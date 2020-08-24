# Foodfy

> Status do Projeto: Em desenvolvimento :warning:

## Tabela de Conteúdos

- [X] Listagem e detalhamento de receitas
- [X] Criação de receitas
- [X] Edição de receitas
- [X] Deletar receitas
- [X] Banco de dados PostgreSQL
- [X] Cadastro, listagem e edição de Chefs
- [X] Receitas atribuídas a um Chef
- [X] Busca por receitas filtrada pelo nome
- [X] Paginação na página de listagem de receitas

## Descrição

## Layout ou Deploy da aplicação

## Pré-requisitos

## Dependências e Libs instaladas

* [Express](https://expressjs.com/)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [FileSystem](https://nodejs.org/api/fs.html#fs_file_system)
* [Method-Override](http://expressjs.com/en/resources/middleware/method-override.html)

## Como rodar a aplicação

## Como rodar os testes

## Database

### Recipes
| id | chef_id      | title         | image | ingredients[]          | preparation[]                            | information |
| -- | ------------ | ------------- | ----- | ---------------------- | ---------------------------------------- | ----------- |
| 4  | 3            | Prato da casa | url   | feijão, batata, cuscuz | ferver, triturar a batata, misturar tudo | sal a gosto |

### Chefs
| id | name         | avatar_url  |
| -- | ------------ | ----------- |
| 3  | Daniel Smith | https://... |

## Solução de problemas

## Contribuintes

## Tarefas em aberto
* Refatorar as funções do arquivo **scripts.js**

## Licença