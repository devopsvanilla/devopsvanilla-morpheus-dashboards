# Recent Activity Widget - Guia de Configuração

## Visão Geral

O widget Recent Activity exibe atividades recentes do Morpheus no dashboard, ajudando a acompanhar eventos importantes diretamente na Home.

## Onde está no código

- Componente: `morpheus-home-dashboard-plugin/src/assets/js/activity/recent-activity-widget.jsx`
- Registro: `morpheus-home-dashboard-plugin/src/main/groovy/com/morpheusdata/dashboard/**` (registrado no `MorpheusHomeDashboardPlugin.groovy`)

## Pré-requisitos

1. Morpheus 6.0+
2. Plugin de Dashboard instalado
3. Permissões adequadas (ex.: `activity`)

## Como adicionar ao Dashboard

- Os widgets são adicionados via personalização de dashboard por usuário na UI do Morpheus.
- Abra as preferências do Dashboard do usuário, localize "Recent Activity" e adicione ao layout.

## Parâmetros de Configuração

- Este widget normalmente não requer configuração específica.
- Respeita filtros/escopo do usuário e atualizações por evento `morpheus:refresh`.

## Dicas

- Verifique se seu usuário possui permissão para visualizar atividades.
- Use o evento global de refresh para garantir atualização do conteúdo.
