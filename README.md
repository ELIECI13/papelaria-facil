# Papelaria Fácil

Sistema web simples para controle de uma pequena papelaria. O projeto reúne cadastro de produtos, estoque, venda e histórico em uma única aplicação que funciona direto no navegador.

**Demo online:** https://elieci13.github.io/papelaria-facil/

## O que dá para fazer

- cadastrar, editar, pesquisar e excluir produtos;
- informar preço de custo e preço de venda;
- acompanhar a margem bruta de cada produto;
- controlar estoque atual e estoque mínimo;
- identificar produtos com estoque baixo ou zerado;
- montar uma venda com vários itens;
- aplicar desconto e calcular o total;
- baixar automaticamente o estoque ao finalizar uma venda;
- consultar o histórico de vendas;
- exportar o histórico em CSV;
- alternar entre tema claro e escuro.

Os produtos e as vendas ficam armazenados no `LocalStorage` do navegador. Não há servidor ou banco de dados neste projeto.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- DOM e eventos
- LocalStorage
- geração de CSV no navegador
- layout responsivo

## Como testar

A forma mais rápida é acessar a demo online. Também é possível baixar os arquivos e abrir `index.html` diretamente no navegador. Não há dependências para instalar.

## Por que criei este projeto

Quis montar uma aplicação um pouco mais completa do que uma calculadora isolada. O objetivo foi praticar um fluxo que se aproxima de uma necessidade real de uma loja pequena: cadastrar produtos, acompanhar estoque, montar uma venda e manter um histórico.

É um projeto de estudo e não substitui um sistema comercial com banco de dados, controle fiscal, autenticação e backup.