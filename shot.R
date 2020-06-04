library(ggplot2)
library(ggsoccer)
i=1
map=function(shots, Teamname) {
  shotmap = ggplot(shots) +
    annotate_pitch(colour="white",
                   fill="chartreuse4",
                   limits=FALSE) +
    geom_point(aes(x=x, y=100-y),
               colour = "yellow",
               size = 4)+
    theme_pitch() +
    theme(plot.background = element_rect(fill="chartreuse4"),
          title=element_text(colour="white")) +
    coord_flip(xlim = c(49,101),
               ylim = c(-1, 101)) +
    ggtitle(TeamName, "Shotmap")
  print(shotmap)
}

TeamName="Liverpool"
while(i==1) {
  cat("\n1. Liverpool Shot map\n2. Madridi shotmap\n3. Barcelona Shotmap\n4. Exit\nEnter choice")
  c=readline()
  if(c==1) {
    shots = data.frame(x=c(60, 85,82,78,83,74,94,91),
                       y=c(43,40,52,56,44,71,60,54))
    TeamName="Liverpool"
    map(shots, TeamName)
  }
  else
    i=0
}