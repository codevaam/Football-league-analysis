datarad = read.csv('data.csv')
head(datarad)
library('plotly')
rad = datarad[c('Name', 'Finishing', 'Dribbling', 'SprintSpeed', 'ShortPassing', 'StandingTackle')]

player1 = "L. Messi"

player2 = "Cristiano Ronaldo"

cmp = rad[(rad$Name==player1), c('Finishing', 'Dribbling', 'SprintSpeed', 'ShortPassing', 'StandingTackle')]
cmp = rbind(cmp, rad[(rad$Name==player2), c('Finishing', 'Dribbling', 'SprintSpeed', 'ShortPassing', 'StandingTackle')])
pc1=c(cmp$Finishing[1], cmp$Dribbling[1], cmp$SprintSpeed[1], cmp$ShortPassing[1], cmp$StandingTackle[1])
pc2=c(cmp$Finishing[2], cmp$Dribbling[2], cmp$SprintSpeed[2], cmp$ShortPassing[2], cmp$StandingTackle[2])
typeof(pc1)
p = plot_ly(type='scatterpolar', fill='toself') %>% 
  add_trace(r=pc1, theta = c('Shoot', 'Movement', 'Pace', 'Passing', 'Defence'), name=player1) %>%
  add_trace(r=pc2, theta = c('Shoot', 'Movement', 'Pace', 'Passing', 'Defence'), name=player2) %>%
  layout(polar = list(radialaxis = list(visible = T, range=c(0,100))))
print(p)
