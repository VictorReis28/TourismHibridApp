USE tourism_app;

INSERT INTO attractions (id, name, description, image, rating, reviews, category_id, latitude, longitude)
VALUES
  -- Monumentos
  (1,'Cristo Redentor','Estátua icônica com vista panorâmica do Rio de Janeiro.','',4.9,120000,(SELECT id FROM categories WHERE name='Monumentos'),-22.951916,-43.210487),
  (2,'Pão de Açúcar','Morro com bondinho e vistas espetaculares.','',4.8,95000,(SELECT id FROM categories WHERE name='Monumentos'),-22.948559,-43.156579),

  -- Museus
  (3,'Museu do Amanhã','Museu de ciências com arquitetura futurista.','',4.7,85000,(SELECT id FROM categories WHERE name='Museus'),-22.896840,-43.180350),
  (4,'Pinacoteca de SP','Uma das mais antigas galerias de arte do Brasil.','',4.6,42000,(SELECT id FROM categories WHERE name='Museus'),-23.530700,-46.633598),

  -- Natureza
  (5,'Jardim Botânico do Rio','Grande diversidade de plantas tropicais.','',4.7,40000,(SELECT id FROM categories WHERE name='Natureza'),-22.968060,-43.224573),
  (6,'Jardim Botânico de SP','Espaço verde com estufas e orquidário.','',4.6,30000,(SELECT id FROM categories WHERE name='Natureza'),-23.181006,-46.839041),

  -- Religiosos
  (7,'Catedral de Brasília','Projetada por Oscar Niemeyer.','',4.6,50000,(SELECT id FROM categories WHERE name='Religiosos'),-15.799035,-47.864566),
  (8,'Basílica de Aparecida','Maior templo mariano do mundo.','',4.8,78000,(SELECT id FROM categories WHERE name='Religiosos'),-22.806781,-45.030285),

  -- Parques
  (9,'Parque Ibirapuera','Parque urbano famoso em São Paulo.','',4.8,95000,(SELECT id FROM categories WHERE name='Parques'),-23.587415,-46.657634),
  (10,'Parque da Cidade (Brasília)','Mirante natural e pistas de corrida.','',4.7,28000,(SELECT id FROM categories WHERE name='Parques'),-15.793500,-47.899200),

  -- Arquitetura
  (11,'Edifício Copan','Ícone de Oscar Niemeyer em SP.','',4.5,21000,(SELECT id FROM categories WHERE name='Arquitetura'),-23.550520,-46.641690),
  (12,'Museu Oscar Niemeyer','Centro de cultura e arquitetura em Curitiba.','',4.6,46000,(SELECT id FROM categories WHERE name='Arquitetura'),-25.434523,-49.265946),

  -- Praias
  (13,'Praia de Copacabana','Famosa orla carioca.','',4.5,180000,(SELECT id FROM categories WHERE name='Praias'),-22.971177,-43.182543),
  (14,'Praia do Forte (BA)','Costa de piscinas naturais.','',4.6,35000,(SELECT id FROM categories WHERE name='Praias'),-12.582094,-38.017264),

  -- Gastronomia
  (15,'Mercado Municipal de SP','Tempero paulista e pastel de bacalhau.','',4.6,75000,(SELECT id FROM categories WHERE name='Gastronomia'),-23.541630,-46.631589),
  (16,'Rua das Flores (Curitiba)','Bistrôs e cafés charmosos.','',4.5,18000,(SELECT id FROM categories WHERE name='Gastronomia'),-25.429798,-49.269419),

  -- Compras
  (17,'Shopping Iguatemi SP','Loja de luxo e gastronomia premium.','',4.4,40000,(SELECT id FROM categories WHERE name='Compras'),-23.573867,-46.691491),
  (18,'Rua 25 de Março','Maior centro de comércio popular.','',4.1,120000,(SELECT id FROM categories WHERE name='Compras'),-23.543080,-46.632740),

  -- Vida Noturna
  (19,'Lapa – Rio de Janeiro','Bares e música ao vivo.','',4.5,65000,(SELECT id FROM categories WHERE name='Vida Noturna'),-22.912159,-43.187349),
  (20,'Vila Madalena – SP','Botecos e galerias de arte.','',4.6,55000,(SELECT id FROM categories WHERE name='Vida Noturna'),-23.561413,-46.704263),

  -- Eventos
  (21,'Carnaval do Rio','Maior festa de rua do planeta.','',4.8,100000,(SELECT id FROM categories WHERE name='Eventos'),-22.910674,-43.182123),
  (22,'Bienal de São Paulo','Feira de arte contemporânea.','',4.4,15000,(SELECT id FROM categories WHERE name='Eventos'),-23.587417,-46.655730),

  -- Histórico
  (23,'Pelourinho (Salvador)','Centro colonial colorido.','',4.7,65000,(SELECT id FROM categories WHERE name='Histórico'),-12.971399,-38.510664),
  (24,'Ouro Preto','Cidade Museu do ciclo do ouro.','',4.8,47000,(SELECT id FROM categories WHERE name='Histórico'),-20.385271,-43.503942),

  -- Esportes
  (25,'Maracanã','Templo do futebol brasileiro.','',4.6,82000,(SELECT id FROM categories WHERE name='Esportes'),-22.912163,-43.230182),
  (26,'Autódromo de Interlagos','Grande Prêmio do Brasil de F1.','',4.5,26000,(SELECT id FROM categories WHERE name='Esportes'),-23.703611,-46.699167),

  -- Aventura
  (27,'Passeio de Jipe – Lençóis Maranhenses','Dunas e lagoas incríveis.','',4.8,20000,(SELECT id FROM categories WHERE name='Aventura'),-2.408333,-43.070000),
  (28,'Rafting no Rio Paranhana','Aventura em corredeiras (RS).','',4.7,5000,(SELECT id FROM categories WHERE name='Aventura'),-29.550000,-51.150000),

  -- Cultura
  (29,'Theatro Municipal RJ','Ballet e ópera em belíssimo prédio.','',4.7,25000,(SELECT id FROM categories WHERE name='Cultura'),-22.910094,-43.185267),
  (30,'Teatro Amazonas','Símbolo da Belle Époque em Manaus.','',4.8,28000,(SELECT id FROM categories WHERE name='Cultura'),-3.127625,-60.021347),

  -- Mirantes
  (31,'Mirante Dona Marta','Vista para Pão de Açúcar.','',4.8,30000,(SELECT id FROM categories WHERE name='Mirantes'),-22.948612,-43.180839),
  (32,'Mirante da Lua (Chapada dos Veadeiros)','Formações rochosas únicas.','',4.7,12000,(SELECT id FROM categories WHERE name='Mirantes'),-14.170000,-47.600000),

  -- Passeios de Barco
  (33,'Barco pelo Rio Amazonas','Cruzeiro em Manaus.','',4.6,15000,(SELECT id FROM categories WHERE name='Passeios de Barco'),-3.119028,-60.021731),
  (34,'Barco na Lagoa dos Patos','Passeio em Rio Grande do Sul.','',4.4,4000,(SELECT id FROM categories WHERE name='Passeios de Barco'),-32.031667,-52.098333),

  -- Cachoeiras
  (35,'Cachoeira do Caracol','131 m em Canela, RS.','',4.7,22000,(SELECT id FROM categories WHERE name='Cachoeiras'),-29.357222,-50.413889),
  (36,'Cachoeira da Fumaça','Chapada Diamantina, BA.','',4.8,18000,(SELECT id FROM categories WHERE name='Cachoeiras'),-12.581944,-41.317222),

  -- Trilhas
  (37,'Trilha do Morro Dois Irmãos','Vista espetacular no Rio.','',4.6,18000,(SELECT id FROM categories WHERE name='Trilhas'),-22.994444,-43.205833),
  (38,'Trilha da Pedra Bonita','Parque Nacional da Tijuca.','',4.7,14000,(SELECT id FROM categories WHERE name='Trilhas'),-22.983333,-43.245000),

  -- Entretenimento
  (39,'Bate Papo no Vivo Rio','Casa de shows na orla.','',4.5,12000,(SELECT id FROM categories WHERE name='Entretenimento'),-22.975278,-43.180278),
  (40,'Via Funchal','Espaço de eventos em SP.','',4.4,8000,(SELECT id FROM categories WHERE name='Entretenimento'),-23.644167,-46.698333),

  -- Ecoturismo
  (41,'Floresta da Tijuca','Maior floresta urbana do mundo.','',4.7,40000,(SELECT id FROM categories WHERE name='Ecoturismo'),-22.948620,-43.252445),
  (42,'Parque Nacional da Chapada dos Veadeiros','Cânions e cachoeiras.','',4.8,22000,(SELECT id FROM categories WHERE name='Ecoturismo'),-14.136111,-47.530556),

  -- Rural
  (43,'Vale dos Vinhedos','Vinícolas no RS.','',4.8,15000,(SELECT id FROM categories WHERE name='Rural'),-29.017778,-51.197778),
  (44,'Campos do Jordão','Estância de montanha em SP.','',4.6,60000,(SELECT id FROM categories WHERE name='Rural'),-22.743056,-45.588333),

  -- Tecnologia
  (45,'InovaBra Habitat','Hub de inovação em SP.','',4.3,1200,(SELECT id FROM categories WHERE name='Tecnologia'),-23.561111,-46.655556),
  (46,'Campus Party Brasil','Maior evento tech da América Latina.','',4.2,5000,(SELECT id FROM categories WHERE name='Tecnologia'),-23.550000,-46.633333),

  -- Arte Urbana
  (47,'Beco do Batman','Galeria de grafites ao ar livre em SP.','',4.7,35000,(SELECT id FROM categories WHERE name='Arte Urbana'),-23.555830,-46.693012),
  (48,'Rua Gonçalo de Carvalho','Rua das árvores floridas em POA.','',4.6,8000,(SELECT id FROM categories WHERE name='Arte Urbana'),-30.035833,-51.195833),

  -- Feiras
  (49,'Feira de São Cristóvão','Cultura nordestina no Rio.','',4.5,20000,(SELECT id FROM categories WHERE name='Feiras'),-22.861440,-43.269868),
  (50,'Feira Hippie BH','Artesanato e comidas típicas.','',4.4,15000,(SELECT id FROM categories WHERE name='Feiras'),-19.919167,-43.937222),

  -- Zoológicos
  (51,'Zoo de São Paulo','Mais de 3 000 animais.','',4.4,30000,(SELECT id FROM categories WHERE name='Zoológicos'),-23.519528,-46.622170),
  (52,'Zoo de Brasília','Variedade de espécies brasileiras.','',4.3,18000,(SELECT id FROM categories WHERE name='Zoológicos'),-15.766667,-47.899444),

  -- Aquários
  (53,'Aquário de São Paulo','Atrações marinhas e de água doce.','',4.3,25000,(SELECT id FROM categories WHERE name='Aquários'),-23.546197,-46.610632),
  (54,'Aquário de Ubatuba','Bacia hidrográfica e peixes tropicais.','',4.4,8000,(SELECT id FROM categories WHERE name='Aquários'),-23.436389,-45.106111),

  -- Parques Temáticos
  (55,'Beto Carrero World','Maior parque temático da América Latina.','',4.7,100000,(SELECT id FROM categories WHERE name='Parques Temáticos'),-27.121389,-48.660833),
  (56,'Hopi Hari','Parque de diversões em SP.','',4.5,80000,(SELECT id FROM categories WHERE name='Parques Temáticos'),-23.024444,-47.150278),

  -- Sítios Arqueológicos
  (57,'Parque Nacional da Serra da Capivara','Pinturas rupestres no Piauí.','',4.8,6000,(SELECT id FROM categories WHERE name='Sítios Arqueológicos'),-8.501389,-42.595000),
  (58,'Complexo de São Miguel das Missões','Ruínas jesuíticas no RS.','',4.6,12000,(SELECT id FROM categories WHERE name='Sítios Arqueológicos'),-27.356389,-54.471389),

  -- Patrimônio Mundial
  (59,'Centro Histórico de Ouro Preto','Patrimônio UNESCO.','',4.8,47000,(SELECT id FROM categories WHERE name='Patrimônio Mundial'),-20.385271,-43.503942),
  (60,'Parque Nacional do Iguaçu','Cataratas do Iguaçu.','',4.9,110000,(SELECT id FROM categories WHERE name='Patrimônio Mundial'),-25.695278,-54.436111),

  -- Passeios de Trem
  (61,'Trem Serra Verde Express','Curitiba–Morretes.','',4.7,15000,(SELECT id FROM categories WHERE name='Passeios de Trem'),-25.427778,-49.273333),
  (62,'Maria Fumaça (Tiradentes–São João del Rei)','Viagem histórica em MG.','',4.8,8000,(SELECT id FROM categories WHERE name='Passeios de Trem'),-21.647778,-44.209167),

  -- Cicloturismo
  (63,'Ciclovia Rio–Niterói','Travessia de bike na ponte.','',4.4,5000,(SELECT id FROM categories WHERE name='Cicloturismo'),-22.879167,-43.103056),
  (64,'Estrada Real de Bike','Trecho histórico em MG.','',4.7,3000,(SELECT id FROM categories WHERE name='Cicloturismo'),-20.303611,-44.246667),

  -- Observação de Aves
  (65,'Pantanal Mato-grossense','Rico em avifauna.','',4.8,9000,(SELECT id FROM categories WHERE name='Observação de Aves'),-16.250000,-56.650000),
  (66,'Ilha do Cardoso (SP)','Refúgio de aves costeiras.','',4.7,4000,(SELECT id FROM categories WHERE name='Observação de Aves'),-25.106667,-47.726389),

  -- Pesca
  (67,'Lagoa dos Patos','Pesca esportiva em RS.','',4.5,2000,(SELECT id FROM categories WHERE name='Pesca'),-32.031667,-52.098333),
  (68,'Rio São Francisco','Pesca de tucunaré.','',4.6,5000,(SELECT id FROM categories WHERE name='Pesca'),-9.649167,-38.586111),

  -- Golf
  (69,'Olympic Golf Course (Rio)','Campo de golfe olímpico.','',4.4,3000,(SELECT id FROM categories WHERE name='Golf'),-22.968056,-43.215556),
  (70,'São Paulo GC','Um dos melhores do Brasil.','',4.5,2500,(SELECT id FROM categories WHERE name='Golf'),-23.557500,-46.699167),

  -- Spa & Bem-estar
  (71,'Tauá Resort SP','Centro de bem-estar em campo.','',4.3,2200,(SELECT id FROM categories WHERE name='Spa & Bem-estar'),-23.378056,-46.778611),
  (72,'Celebration Resort Olímpia','Spa e águas termais.','',4.4,5000,(SELECT id FROM categories WHERE name='Spa & Bem-estar'),-20.733333,-48.909167),

  -- Hotéis Históricos
  (73,'Hotel das Cataratas (Iguaçu)','Único dentro do parque.','',4.6,8000,(SELECT id FROM categories WHERE name='Hotéis Históricos'),-25.694722,-54.436667),
  (74,'Grande Hotel Campos','Patrimônio de Campos do Jordão.','',4.5,3000,(SELECT id FROM categories WHERE name='Hotéis Históricos'),-22.742778,-45.588056),

  -- Castelos
  (75,'Castelo de Itaipava','Releitura de estilo europeu.','',4.2,2000,(SELECT id FROM categories WHERE name='Castelos'),-22.462500,-43.017500),
  (76,'Castelo Mourisco (Rio)','Parte do Parque Lage.','',4.4,4000,(SELECT id FROM categories WHERE name='Castelos'),-22.967500,-43.225000),

  -- Mercados
  (77,'Mercado Público de Florianópolis','Frutos do mar e artesanato.','',4.5,12000,(SELECT id FROM categories WHERE name='Mercados'),-27.593889,-48.553056),
  (78,'Mercado Central de BH','Produtos mineiros típicos.','',4.6,20000,(SELECT id FROM categories WHERE name='Mercados'),-19.921389,-43.934444);