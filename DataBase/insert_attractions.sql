USE tourism_app;

-- Exemplo de inserção de atrações
INSERT INTO attractions (id, name, description, image, rating, reviews, category_id, latitude, longitude)
VALUES
  ('1', 'Cristo Redentor', 'Estátua icônica com vista panorâmica do Rio de Janeiro.', 'cristo.jpg', 4.9, 12000, (SELECT id FROM categories WHERE name='Monumentos'), -22.9519167, -43.2104872),
  ('2', 'Museu do Amanhã', 'Museu de ciências com arquitetura futurista.', 'museu.jpg', 4.7, 8500, (SELECT id FROM categories WHERE name='Museus'), -22.8968, -43.1806),
  ('3', 'Parque Ibirapuera', 'Parque urbano famoso em São Paulo.', 'ibirapuera.jpg', 4.8, 9500, (SELECT id FROM categories WHERE name='Parques'), -23.5874167, -46.6576342),
  ('4', 'Catedral de Brasília', 'Catedral moderna projetada por Oscar Niemeyer.', 'catedral.jpg', 4.6, 5000, (SELECT id FROM categories WHERE name='Religiosos'), -15.7989, -47.8758),
  ('5', 'Jardim Botânico do Rio', 'Jardim botânico com grande diversidade de plantas.', 'jardim.jpg', 4.7, 4000, (SELECT id FROM categories WHERE name='Natureza'), -22.9681, -43.2292);
