
# 🏁 MenteMX Pro - Product.md

## 1. Visão do Produto
O **MenteMX Pro** é o app do programa **Mente MX** — uma plataforma de inteligência esportiva e programa mental desenhada exclusivamente para pilotos e atletas do mundo offroad. O objetivo é transformar a percepção subjetiva do piloto em dados analíticos, permitindo uma evolução técnica e mental baseada em métricas reais de performance, consistência e setup.

**Slogan:** *Dados criam campeões.*

---

## 2. Problemas a Resolver
- **Falta de Dados:** Pilotos raramente registram tempos e ajustes de forma estruturada.
- **Evolução Cega:** Dificuldade em identificar se a melhora vem da técnica, do preparo físico ou do ajuste da moto.
- **Gestão de Setup:** Perda de configurações ideais de suspensão e pneus para diferentes tipos de terreno.

---

## 3. Arquitetura do Sistema (Kiro / Stack)
Para garantir agilidade e performance em ambiente de pista:
- **Frontend:** Mobile-First (Design de alto contraste para visibilidade sob sol).
- **Backend:** Node.js com estrutura de dados JSON para facilitar a escalabilidade.
- **Local-First:** O app deve permitir o registro de dados sem internet (offline), sincronizando quando houver sinal.

---

## 4. Módulos Principais (MVP)

### A. Módulo Analytics (O Coração)
- **Cálculo de Consistência:** Algoritmo que analisa o desvio padrão das voltas.
- **MX Score:** Uma pontuação proprietária de 0 a 1000 baseada na performance recente.
- **Gráfico de Radar:** Visualização 360º de: *Performance, Consistência, Mental, Físico e Setup*.

### B. Módulo de Setup Técnico
- **Log de Cliques:** Registro de compressão e retorno da suspensão.
- **Pneus e Relação:** Gestão de pressão e componentes mecânicos por tipo de solo (barro, areia, misto).

### C. Módulo de Eventos
- Cadastro de corridas e treinos.
- Registro de Holeshot e posição final.

---

## 5. Roadmap de Desenvolvimento

### Fase 1: Fundação (Dias 1-30)
- Estrutura de banco de dados (Cadastro de Piloto/Moto).
- Interface de entrada de tempos de volta.
- Landing Page de pré-lançamento.

### Fase 2: Inteligência (Dias 31-60)
- Implementação dos cálculos de Consistência.
- Geração automática do MX Score.
- Dashboards de evolução técnica.

### Fase 3: Retenção (Dias 61-90)
- Gamificação (Streaks de treino).
- Exportação de relatórios para patrocinadores/equipes.
- Lançamento da Comunidade Fechada.

---

## 6. Diferenciais Estratégicos
- **Foco em Nicho:** Diferente de apps de GPS genéricos, o MenteMX Pro entende a linguagem do offroad (cliques de suspensão, cansaço de braço, leitura de terreno).
- **Design "Modo Luva":** Interface com botões grandes e comandos simplificados para uso rápido entre as baterias.
- **Programa Mental:** Integração de dimensões Mental e Físico no acompanhamento do piloto, indo além da performance pura.

---

## 7. Manifesto de Negócio
Não estamos a construir apenas um app de anotações. Estamos a construir o padrão nacional de análise para o off-road brasileiro. O MenteMX Pro é a mente estratégica que acompanha o piloto do portão de largada até o pódio.

---

**Mente MX - Mentor de Alta Performance**
*Analise. Ajuste. Acelere.*