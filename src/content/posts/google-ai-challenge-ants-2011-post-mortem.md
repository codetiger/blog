---
title: "Google AI Challenge Ants 2011 - Post Mortem"
date: 2011-12-30T03:58:00.000Z
slug: "google-ai-challenge-ants-2011-post-mortem"
tags: ["AI-Contest"]
featureImage: "/blog/assets/images/2023/08/Screenshot-2023-08-24-at-9.14.57-AM.png"
draft: false
---
As a 3 week hard work and sleepless nights, I took the 127th [rank](http://aichallenge.org/rankings.php?page=2) in Google AI Challenge Ants 2011 and 1st in my country [India](http://aichallenge.org/country_profile.php?country=5). I thought the experience was worth sharing in this blog. In-between the competition, I had some health issues that kept me out of reach of computer for a week. Of course health was worse after the competition started. However, I managed to make it normal with a week long vacation with family.

**Initial Idea:**  
Initially when I first learnt about the competition, I thought it would be a simple problem to solve. The first thought that came to my mind was grouping ants together to fight enemies. Because, the aim of the competition sounded more like, just keeping your ants live. So I thought I could build a group of ants making a + sign with just 4 ants each.But eventually, when I started working on the game, I learnt, it affected exploring and food gathering a lot. And decided to concentrate on food gathering and exploration first.

**Exploration and Food Gathering:**  
I tried a different way of using scent maps for food gathering and exploration. Totally, I fill 3 different scent maps depending on priority. The first map is for food and exploration. This map will carry a scent until it finds the first ant, then the scent will stop spreading on all sides. This will ensure one ant for one target policy. This way of spreading is unique for food and exploration map. I tried this idea to avoid many ants moving towards the nearest target which is usual for scent maps. To the map, I add maximum integer to the source cell. Food and unseen cells are my initial source seeds. This will make it easier to explore as fast as you can. But there is a problem with this technique, the ants will not re-explore visited areas to search for new food. So I started seeding the cells those were not visible for the past 6 turns. Why 6 !?!? coz adding the digits of 42 gives 6. In simple words, I do not have a answer why I chose 6 but it worked out better than other numbers.

To decide on the number I could have tried a simple genetic algorithm, but I didn't have enough time to setup local game servers for that. I'll keep such tasks for next contest. However, I tried letting same bots with different numbers (4 to 12) to each other to decide on this number.

Finally, I can see my bot exploring and gathering food as fast as any top bots, irrespective of any type of maps. The scent maps helped a lot, especially after choosing a slow programming language like python. At least 5 times, I considered poring my code to different language during this contest.

Best Example for Exploration and Food Gathering:

> **[Visualizer | AI Challenge](http://ants.aichallenge.org/visualizer.php?game=284365&user=8695)**  
> The AI Challenge (sponsored by Google) is an international programming contest started by the University of Waterloo Computer Science Club.

**Combat and escape**:  
After settling with a decent exploring and gathering code, I decide to choose the most efficient way of fighting with other ants. I first considered random sampling method explained by user a1k0n in the forum. However, it didn't impress me a lot. So I decided trying my own simple battle resolution method using 2 radii calculations. However, after implementing my method I learnt, I might have to calculate 3 radii for battle to resolve efficiently. And my code time-out even with 2 radii, so continuing this might be disastrous with the language I chose. So I decided to take another route by Memetix, in which all battle resolutions were pre-calculated. Now, my ants do not die in 1 vs 1 fights.

Best Example for Combat:

> **[Visualizer | AI Challenge](http://ants.aichallenge.org/visualizer.php?game=343678&user=8695)**  
> The AI Challenge (sponsored by Google) is an international programming contest started by the University of Waterloo Computer Science Club.

**3 scent maps**: Like I said before, I used 3 scent maps according to priority. All ants first check the 1st maps that can is called hill scent map and is seeded with just enemy hills, if found. The scent travels to a distance of

> (self**.**rows**+**self**.**cols)**/**6

The reason again being (42 => 4 + 2 = 6). The next priority maps is the food map that travels until it finds the nearest ant. The third map is just a worst case map, that is filled with enemy hills, food, and unseen cells. This map makes sure no ant is left idle, in any case.

**Strategies**:  
With a decent exploration, food gathering and combat resolution code, it was easy to reach top 500. But my aim was to get into the top 100 list which might need a lot more heuristic improvements to my bot. So I considered trying different strategies to boost the performance. One very important improvement I did was blocking the path for the enemies to enter my territory. All that I did to bring this is, seeded enemy ants and all ants including ally will block scents, so until the opening in the maze is closed the enemy ants will generate scent. And this scent is sent to the 3rd map, if the ant has no scent in 1st and 2nd maps.  
  
Overall, the performance was much better at this point. However, my bot performed very poor in close neighbor multi hill mazes. So I decided to tune my bot to do some sacrifices near my hill within a certain radius. The radius, I chose was 14 (coz 42 was divisible by 14). This simple change in my combat code that does sacrifice ants in 1v1 combats saved my hills from being visible very early. So I my ants had enough time to breath and collect food.

Best Game for hill sacrifice:

> **[Visualizer | AI Challenge](http://ants.aichallenge.org/visualizer.php?game=346313&user=8695)**  
> The AI Challenge (sponsored by Google) is an international programming contest started by the University of Waterloo Computer Science Club.

Also, my bot sacrifices some of its hills to concentrate on exploring and food gathering. I didn't make it intensionally, but it was a bug in the other strategy but it was worth keeping it. However, some final change made the performance worse on other maps, which I didn't care much as I had no enough time to think about tuning further. I left my bot with that and sat back to watch it play.  
  
During this competition, I learnt a lot of new topics that would help in future. Some of the topics were very surprising to me. I felt those topics were very much for scientific experiments and not for gaming. However, this contest changed my thought about such topics.

-   A\* Shortest Path
-   BFS Shortest Path
-   Collaborative Diffusion
-   Scent/Distance Maps
-   Heuristic Decision Making
-   Random Sampling
-   MiniMax
-   Genetic Algorithm
-   Genetic Programming

and a lot more. Hope I'll keep those new interesting topics for my next contest. Lastly, I would like to thank the contest organizers, TCP serve hosts, Tool designer and co-participants.
