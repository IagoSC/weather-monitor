# Weather monitor

This project is a weather monitor with focus on sports.


## How to run

start kafka and zookeeper
em um terminal:

    cd /Consumer 
    npm i
    npm start

em outro terminal:
    
    cd /Producer 
    npm i
    npm start

## Glossário
    Manhã: 6h ~ 10h
    Meio-dia: 10h ~ 14h
    Tarde: 14h ~ 18h
    Noite: 18h ~ 22h
    
## Algumas possibilidades: 
- Monitoramento exclusivo para Surfe. Variavel monitorada: Maré, Radiação solar, Vento (velocidade e direção)
    Evento: Variavel (Mar, Radiação e Vento) e grau (Ótimo / Bom / Ruim)
    Tópicos: Local (Uma praia) / Horário (Manhã, Meio-dia e Tarde)
    Evento composto: Super-série de Eventos bons (3 dias seguidos de boas)

- Monitoramento de esportes ao ar livre: Alpinismo, Corrida e Surfe
    Evento: Variavel (Mar, Radiação e Vento) e grau (Ótimo / Bom / Ruim)
    Tópicos: Local (Uma praia) + Horário (Manhã, Meio-dia e Tarde, Noite) + Esporte 
    Evento composto: Super-série de Eventos bons (3 dias seguidos de boas)
      
        
