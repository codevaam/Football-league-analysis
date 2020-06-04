library('plotly')
data = read.csv('./team.csv')
head(data)
# cat("\nEnter Team name: ")
# tn = readline()
tn = "Manchester United"
team= data[data$club_name==tn, c('full_name', 'appearances_overall', 'goals_overall', 'assists_overall')]
tmp=0
while(tmp<1){
  cat("\n1. Goals contribution\n2. Assist Contribution\n3. Appearances\n4. Exit\nEnter Choice")
  ch = readline()
  if(ch==1) {
    total=sum(team$goals_overall)
    goaldat=team[(team$goals_overall>4), c('full_name', 'goals_overall')]
    print(goaldat)
    tot2 = sum(goaldat$goals_overall)
    
    others = total-tot2
    player = as.vector(goaldat$full_name)
    player = c(player, 'Others')
    player = player[-1]
    goalbyplayer = as.vector(goaldat$goals_overall)
    goalbyplayer=c(goalbyplayer,others)
    goalbyplayer=goalbyplayer[-1]
    p = plot_ly(labels = player, values = goalbyplayer, type='pie') %>%
        layout(title = 'Goals scored')
  }
  else if(ch==2) {
    total = sum(team$assists_overall)
    asdat = team[(team$assists_overall>2), c('full_name', 'assists_overall')]
    tot2 = sum(asdat$assists_overall)
    others = total - tot2
    player = as.vector(asdat$full_name)
    player = c(player, 'Others')
    player = player[-1]
    asbyplayer = as.vector(asdat$assists_overall)
    asbyplayer = c(asbyplayer, others)
    asbyplayer = asbyplayer[-1]
    p = plot_ly(labels = player, values = asbyplayer, type='pie') %>%
        layout(title = 'Assists contribution')
    print(p)
  }
  else if(ch==3){
    total = sum(team$appearances_overall)
    asdat = team[(team$appearances_overall>15), c('full_name', 'appearances_overall')]
    tot2 = sum(asdat$appearances_overall)
    others = total-tot2
    player = as.vector(asdat$full_name)
    player = c(player, 'Others')
    player = player[-1]
    asbyplayer = as.vector(asdat$appearances_overall)
    asbyplayer = c(asbyplayer, others)
    asbyplayer = asbyplayer[-1]
    p = plot_ly(labels = player, values = asbyplayer, type='pie') %>%
        layout(title = 'Appearances contribution')
    print(p)
  }
  if(ch==4) {
    tmp=1
  }
}
