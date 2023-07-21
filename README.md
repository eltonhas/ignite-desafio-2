# DAILY DIET API

## Passo a passo para a criação da API

* npm init -y
* instalação das dependências
* criar .env
* criar pasta env
* criar arquivo app
* criar arquivo server
* criar arquivo database
* criar arquivo knexfile
* criar pasta db
* configurar o script do knex no packge.json
* comando para gerar migrations - npm run knex -- migrate:make nomedamigration
* preencher a migration e executar - npm run knex -- migrate:latest
### Requisitos do sistema

[x] Criar usuário
[x] Identificar usuário entre as requisições
[x] Registrar refeições, nome, descrição, data e hora, dentro da dieta sim ou não
[x] Editar refeição
[x] Apagar refeição
[x] Listar refeições
[x] Buscar uma refeição
[x] Total de refeições registradas
[x] Total de refeições na dieta
[x] Total de refeições fora da dieta
[x] Maior sequência de refeições na dieta
[x] O usuário só pode listar, editar e apagar as refeições que criou