import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { URL } from "url";
import multipart from "@fastify/multipart";
import fs from "fs";
import path from "path";
import fastifyStatic from "@fastify/static";

require("dotenv").config({ path: __dirname + "/../Back-End/.env" }); // Caminho absoluto para o .env do backend

async function main() {
  const fastify = Fastify();
  await fastify.register(cors, {
    origin: true, // ou especifique o domínio do seu front-end
  });

  // Adiciona suporte a multipart/form-data
  await fastify.register(multipart);

  // Garante que a pasta Photos existe dentro de Backend
  const photosDir = path.join(__dirname, "Photos");
  if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
  }

  // Garante que a pasta ProfilePictures existe dentro de Backend
  const profilePicsDir = path.join(__dirname, "ProfilePictures");
  if (!fs.existsSync(profilePicsDir)) {
    fs.mkdirSync(profilePicsDir, { recursive: true });
  }

  // Servir arquivos estáticos da pasta Photos via HTTP
  await fastify.register(fastifyStatic, {
    root: photosDir,
    prefix: "/Photos/", // URL base para acessar as imagens
  });

  // Servir arquivos estáticos da pasta ProfilePictures via HTTP
  await fastify.register(fastifyStatic, {
    root: profilePicsDir,
    prefix: "/ProfilePictures/",
    decorateReply: false,
  });

  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // --- Auth ---
  fastify.post("/auth/register", async (req, reply) => {
    const { email, password, name } = req.body as any;
    if (!email || !password || !name)
      return reply.status(400).send({ message: "Campos obrigatórios" });
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length > 0)
      return reply.status(400).send({ message: "Email já cadastrado" });
    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await db.query(
      "INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)",
      [id, email, hash, name]
    );
    return reply.send({ user: { id, email, name } });
  });

  fastify.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body as any;
    const [rows] = await db.query(
      "SELECT id, email, name, password, avatar FROM users WHERE email = ?",
      [email]
    );
    const user = (rows as any[])[0];
    if (!user)
      return reply.status(400).send({ message: "Usuário não encontrado" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.status(400).send({ message: "Senha incorreta" });
    delete user.password;
    return reply.send({ user });
  });

  // --- Esqueci a senha ---
  fastify.post("/auth/forgot-password", async (req, reply) => {
    const { email, newPassword } = req.body as any;
    if (!email || !newPassword) {
      return reply
        .status(400)
        .send({ message: "Email e nova senha são obrigatórios" });
    }
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if ((rows as any[]).length === 0) {
      return reply.status(404).send({ message: "Usuário não encontrado" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      hash,
      email,
    ]);
    return reply.send({ message: "Senha alterada com sucesso" });
  });

  // --- Biometria ---
  fastify.get("/users/:id/biometrics", async (req, reply) => {
    const { id } = req.params as any;
    const [rows] = await db.query(
      "SELECT enabled FROM user_biometrics WHERE user_id = ?",
      [id]
    );
    return reply.send({ enabled: (rows as any[])[0]?.enabled || false });
  });

  fastify.put("/users/:id/biometrics", async (req, reply) => {
    const { id } = req.params as any;
    const { enabled } = req.body as any;
    await db.query(
      "INSERT INTO user_biometrics (user_id, enabled) VALUES (?, ?) ON DUPLICATE KEY UPDATE enabled = ?",
      [id, !!enabled, !!enabled]
    );
    return reply.send({ enabled: !!enabled });
  });

  // --- Avatar ---
  fastify.put("/users/:id/avatar", async (req, reply) => {
    const { id } = req.params as any;
    const { avatar } = req.body as any;
    await db.query("UPDATE users SET avatar = ? WHERE id = ?", [avatar, id]);
    return reply.send({ success: true });
  });

  // --- Avatar (upload de foto de perfil via multipart) ---
  fastify.post("/users/:id/profile-picture", async (req, reply) => {
    const { id } = req.params as any;
    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ message: "Arquivo não enviado" });
    }
    const ext = path.extname(data.filename) || ".jpg";
    const filename = `${id}_${Date.now()}${ext}`;
    const filepath = path.join(profilePicsDir, filename);

    // Salva o arquivo na pasta ProfilePictures
    await new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filepath);
      data.file.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });

    // Atualiza o campo avatar do usuário para o caminho relativo
    const avatarPath = `ProfilePictures/${filename}`;
    await db.query("UPDATE users SET avatar = ? WHERE id = ?", [
      avatarPath,
      id,
    ]);
    return reply.send({ avatar: avatarPath });
  });

  // --- Atrações ---
  fastify.get("/attractions", async (req, reply) => {
    const [rows] = await db.query(
      `SELECT a.id, a.name, a.description, a.image, a.rating, a.reviews, c.name as category, a.latitude, a.longitude
       FROM attractions a
       LEFT JOIN categories c ON a.category_id = c.id`
    );
    return reply.send(rows);
  });

  fastify.post("/attractions", async (req, reply) => {
    const { name, description, category, image, latitude, longitude } =
      req.body as any;
    if (!name || !description || !category || !latitude || !longitude)
      return reply.status(400).send({ message: "Campos obrigatórios" });
    // Buscar id da categoria
    const [catRows] = await db.query(
      "SELECT id FROM categories WHERE name = ?",
      [category]
    );
    const category_id = (catRows as any[])[0]?.id;
    if (!category_id)
      return reply.status(400).send({ message: "Categoria inválida" });
    const id = randomUUID();
    await db.query(
      "INSERT INTO attractions (id, name, description, image, category_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, description, image, category_id, latitude, longitude]
    );
    return reply.send({ id });
  });

  fastify.delete("/attractions", async (req, reply) => {
    const { ids } = req.body as any;
    if (!Array.isArray(ids) || ids.length === 0)
      return reply.status(400).send({ message: "IDs obrigatórios" });
    await db.query("DELETE FROM attractions WHERE id IN (?)", [ids]);
    return reply.send({ success: true });
  });

  // Nova rota: atualizar avaliação
  fastify.patch("/attractions/:id/rating", async (req, reply) => {
    const { id } = req.params as any;
    const { rating } = req.body as any;
    if (!rating || rating < 1 || rating > 5) {
      return reply.status(400).send({ message: "Nota inválida" });
    }
    // Busca atual
    const [rows] = await db.query(
      "SELECT rating, reviews FROM attractions WHERE id = ?",
      [id]
    );
    const current = (rows as any[])[0];
    if (!current)
      return reply.status(404).send({ message: "Atração não encontrada" });
    // Média ponderada
    const newReviews = Number(current.reviews) + 1;
    const newRating =
      (Number(current.rating) * Number(current.reviews) + Number(rating)) /
      newReviews;
    await db.query(
      "UPDATE attractions SET rating = ?, reviews = ? WHERE id = ?",
      [newRating, newReviews, id]
    );
    return reply.send({ rating: newRating, reviews: newReviews });
  });

  // --- Categorias ---
  fastify.post("/categories", async (req, reply) => {
    const { name } = req.body as any;
    if (!name) return reply.status(400).send({ message: "Nome obrigatório" });
    const [rows] = await db.query("SELECT id FROM categories WHERE name = ?", [
      name,
    ]);
    if ((rows as any[]).length > 0)
      return reply.status(400).send({ message: "Categoria já existe" });
    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    return reply.send({ success: true });
  });

  // Adicionar rota GET para listar categorias
  fastify.get("/categories", async (req, reply) => {
    const [rows] = await db.query("SELECT id, name FROM categories");
    return reply.send(rows);
  });

  // Rota para upload de fotos
  fastify.post("/photos", async (req, reply) => {
    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ message: "Arquivo não enviado" });
    }
    const ext = path.extname(data.filename) || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(photosDir, filename);

    // Salva o arquivo na pasta Photos
    await new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filepath);
      data.file.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });

    // Retorna o caminho relativo para ser salvo no banco e usado no frontend
    return reply.send({ path: `Photos/${filename}` });
  });

  // --- Teste de conexão ---
  fastify.get("/ping", async (req, reply) => {
    return reply.send({ message: "pong" });
  });

  // --- Inicialização ---
  // Sempre ouve em 0.0.0.0 para aceitar conexões externas/local/ngrok
  fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error("Erro ao iniciar o servidor:", err);
      process.exit(1);
    }
    console.log(`Fastify server rodando em ${address}`);
  });
}

main().catch((err) => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});
