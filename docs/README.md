# Morpheus Dashboard Widgets – Visão Geral

Este documento consolida os widgets disponíveis no repositório e aponta para seus arquivos-fonte. Use-o como índice rápido para descobrir e navegar pelos widgets do plugin.

> Dica: Para detalhes de configuração do widget de conteúdo externo, veja `docs/custom-widget.md`.

## Lista de Widgets (por categoria)

A tabela abaixo lista cada widget com sua categoria e link para o arquivo-fonte.

| Categoria | Widget | Caminho do Código |
|---|---|---|
| Activity | recent-activity-widget | [morpheus-home-dashboard-plugin/src/assets/js/activity/recent-activity-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/activity/recent-activity-widget.jsx) |
| Backups | backup-stats-widget | [morpheus-home-dashboard-plugin/src/assets/js/backups/backup-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/backups/backup-stats-widget.jsx) |
| Clouds | cloud-count-type-widget | [morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-count-type-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-count-type-widget.jsx) |
| Clouds | cloud-workload-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-workload-count-widget.jsx) |
| Clusters | cluster-capacity-widget | [morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-capacity-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-capacity-widget.jsx) |
| Clusters | cluster-type-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-type-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-type-count-widget.jsx) |
| Clusters | cluster-workload-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-workload-count-widget.jsx) |
| Groups | group-workload-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/groups/group-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/groups/group-workload-count-widget.jsx) |
| Health | current-health-widget | [morpheus-home-dashboard-plugin/src/assets/js/health/current-health-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/health/current-health-widget.jsx) |
| Health | current-alarms-widget | [morpheus-home-dashboard-plugin/src/assets/js/health/current-alarms-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/health/current-alarms-widget.jsx) |
| Instances | instance-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-widget.jsx) |
| Instances | instance-count-cloud-widget | [morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-widget.jsx) |
| Instances | instance-count-cloud-day-widget | [morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-day-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-day-widget.jsx) |
| Jobs | job-execution-stats-widget | [morpheus-home-dashboard-plugin/src/assets/js/jobs/job-execution-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/jobs/job-execution-stats-widget.jsx) |
| Logs | log-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/logs/log-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/logs/log-count-widget.jsx) |
| Logs | log-trends-widget | [morpheus-home-dashboard-plugin/src/assets/js/logs/log-trends-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/logs/log-trends-widget.jsx) |
| Tasks | task-execution-stats-widget | [morpheus-home-dashboard-plugin/src/assets/js/tasks/task-execution-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/tasks/task-execution-stats-widget.jsx) |
| Tasks | task-failures | [morpheus-home-dashboard-plugin/src/assets/js/tasks/task-failures.jsx](../morpheus-home-dashboard-plugin/src/assets/js/tasks/task-failures.jsx) |
| Geral | task-executions-over-time-widget | [morpheus-home-dashboard-plugin/src/assets/js/task-executions-over-time-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/task-executions-over-time-widget.jsx) |
| Workflows | workflow-executions-over-time-widget | [morpheus-home-dashboard-plugin/src/assets/js/workflow-executions-over-time-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/workflow-executions-over-time-widget.jsx) |
| Ambiente | environment-count-widget | [morpheus-home-dashboard-plugin/src/assets/js/environment-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/environment-count-widget.jsx) |
| Favoritos | user-favorites-widget | [morpheus-home-dashboard-plugin/src/assets/js/user-favorites-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/user-favorites-widget.jsx) |
| Configurações | settings-widget | [morpheus-home-dashboard-plugin/src/assets/js/settings-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/settings-widget.jsx) |
| Custom | custom-widget | [morpheus-home-dashboard-plugin/src/assets/js/custom/custom-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/custom/custom-widget.jsx) |

> Observação: Também existem módulos auxiliares como `home-dashboard.js` e páginas de lista (ex.: `cloud-list-dashboard.js`, `cluster-list-dashboard.js`) que não são widgets isolados, mas fazem parte do dashboard.

## Como adicionar widgets ao seu Dashboard

- Os widgets ficam disponíveis para personalização por usuário na UI do Morpheus.
- Para instruções detalhadas sobre adicionar e configurar o widget de conteúdo externo, veja: [docs/custom-widget.md](./custom-widget.md).

## Build rápido do plugin

Compile apenas o plugin de dashboard:

```bash
./gradlew morpheus-home-dashboard-plugin:shadowJar
```

O artefato será gerado em:

```text
morpheus-home-dashboard-plugin/build/libs/morpheus-home-dashboard-plugin-<versao>-all.jar
```

## Permissões e acesso

- Cada widget é registrado com um conjunto de permissões (ex.: provisioning, infrastructure, logs, activity, etc.).
- A disponibilidade do widget na UI pode depender das permissões do usuário no Morpheus.

## Dicas e observações

- Alguns widgets utilizam auto-refresh e eventos de atualização do Morpheus (morpheus:refresh).
- Conteúdos externos (como no `custom-widget`) podem ser bloqueados por políticas do servidor de origem (X-Frame-Options / CSP). Consulte o guia em `docs/custom-widget.md`.
- Ao criar novos widgets, siga os padrões de código do projeto (Groovy provider + React component + template HBS + registro no plugin).
