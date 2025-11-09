# Morpheus Dashboard Widgets – Visão Geral

Este documento consolida os widgets disponíveis no repositório e aponta para seus arquivos-fonte. Use-o como índice rápido para descobrir e navegar pelos widgets do plugin.

> Dica: Para detalhes de configuração do widget de conteúdo externo, veja `docs/custom-widget.md`.

## Lista de Widgets (por categoria)

A tabela abaixo lista cada widget com sua categoria, link para o arquivo-fonte e link para a página de documentação individual.

| Categoria | Widget | Caminho do Código | Guia |
|---|---|---|---|
| Activity | recent-activity-widget | [src/assets/js/activity/recent-activity-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/activity/recent-activity-widget.jsx) | [recent-activity-widget.md](./recent-activity-widget.md) |
| Backups | backup-stats-widget | [src/assets/js/backups/backup-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/backups/backup-stats-widget.jsx) | [backup-stats-widget.md](./backup-stats-widget.md) |
| Clouds | cloud-count-type-widget | [src/assets/js/clouds/cloud-count-type-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-count-type-widget.jsx) | [cloud-count-type-widget.md](./cloud-count-type-widget.md) |
| Clouds | cloud-workload-count-widget | [src/assets/js/clouds/cloud-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clouds/cloud-workload-count-widget.jsx) | [cloud-workload-count-widget.md](./cloud-workload-count-widget.md) |
| Clusters | cluster-capacity-widget | [src/assets/js/clusters/cluster-capacity-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-capacity-widget.jsx) | [cluster-capacity-widget.md](./cluster-capacity-widget.md) |
| Clusters | cluster-type-count-widget | [src/assets/js/clusters/cluster-type-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-type-count-widget.jsx) | [cluster-type-count-widget.md](./cluster-type-count-widget.md) |
| Clusters | cluster-workload-count-widget | [src/assets/js/clusters/cluster-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/clusters/cluster-workload-count-widget.jsx) | [cluster-workload-count-widget.md](./cluster-workload-count-widget.md) |
| Groups | group-workload-count-widget | [src/assets/js/groups/group-workload-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/groups/group-workload-count-widget.jsx) | [group-workload-count-widget.md](./group-workload-count-widget.md) |
| Health | current-health-widget | [src/assets/js/health/current-health-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/health/current-health-widget.jsx) | [current-health-widget.md](./current-health-widget.md) |
| Health | current-alarms-widget | [src/assets/js/health/current-alarms-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/health/current-alarms-widget.jsx) | [current-alarms-widget.md](./current-alarms-widget.md) |
| Instances | instance-count-widget | [src/assets/js/instances/instance-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-widget.jsx) | [instance-count-widget.md](./instance-count-widget.md) |
| Instances | instance-count-cloud-widget | [src/assets/js/instances/instance-count-cloud-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-widget.jsx) | [instance-count-cloud-widget.md](./instance-count-cloud-widget.md) |
| Instances | instance-count-cloud-day-widget | [src/assets/js/instances/instance-count-cloud-day-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/instances/instance-count-cloud-day-widget.jsx) | [instance-count-cloud-day-widget.md](./instance-count-cloud-day-widget.md) |
| Jobs | job-execution-stats-widget | [src/assets/js/jobs/job-execution-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/jobs/job-execution-stats-widget.jsx) | [job-execution-stats-widget.md](./job-execution-stats-widget.md) |
| Logs | log-count-widget | [src/assets/js/logs/log-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/logs/log-count-widget.jsx) | [log-count-widget.md](./log-count-widget.md) |
| Logs | log-trends-widget | [src/assets/js/logs/log-trends-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/logs/log-trends-widget.jsx) | [log-trends-widget.md](./log-trends-widget.md) |
| Tasks | task-execution-stats-widget | [src/assets/js/tasks/task-execution-stats-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/tasks/task-execution-stats-widget.jsx) | [task-execution-stats-widget.md](./task-execution-stats-widget.md) |
| Tasks | task-failures-widget | [src/assets/js/tasks/task-failures.jsx](../morpheus-home-dashboard-plugin/src/assets/js/tasks/task-failures.jsx) | [task-failures-widget.md](./task-failures-widget.md) |
| Geral | task-executions-over-time-widget | [src/assets/js/task-executions-over-time-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/task-executions-over-time-widget.jsx) | [task-executions-over-time-widget.md](./task-executions-over-time-widget.md) |
| Workflows | workflow-executions-over-time-widget | [src/assets/js/workflow-executions-over-time-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/workflow-executions-over-time-widget.jsx) | [workflow-executions-over-time-widget.md](./workflow-executions-over-time-widget.md) |
| Ambiente | environment-count-widget | [src/assets/js/environment-count-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/environment-count-widget.jsx) | [environment-count-widget.md](./environment-count-widget.md) |
| Favoritos | user-favorites-widget | [src/assets/js/user-favorites-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/user-favorites-widget.jsx) | [user-favorites-widget.md](./user-favorites-widget.md) |
| Configurações | settings-widget | [src/assets/js/settings-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/settings-widget.jsx) | [settings-widget.md](./settings-widget.md) |
| Custom | custom-widget | [src/assets/js/custom/custom-widget.jsx](../morpheus-home-dashboard-plugin/src/assets/js/custom/custom-widget.jsx) | [custom-widget.md](./custom-widget.md) |

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
