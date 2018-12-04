drop table if exists `questionanswered`;
drop table if exists `answer`;
drop table if exists `question`;
drop table if exists `friend`;
drop table if exists `user`;

create table `user` (
    `id` int not null auto_increment,
    `username` varchar(255) not null,
    `email` varchar(255) not null,
    `password` varchar(255) not null,
    `birthdate` date not null,
    `gender` enum('male', 'female', 'other') not null,
    `img` varchar(255),
    `description` text,
    `score` int default 0,
    primary key (`id`),
    unique key (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1; 

create table `friend` (
    `friendid` int not null,
    `otherfriendid` int not null,
    `request` tinyint(1) not null,
    foreign key (`friendid`) references user(`id`) on delete cascade on update cascade,
    foreign key (`otherfriendid`) references user(`id`) on delete cascade on update cascade,
    unique key (`friendid`, `otherfriendid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table `question` (
    `id` int not null auto_increment,
    `userid` int not null,
    `question` varchar(255) not null,
    primary key (`id`),
    foreign key (`userid`) references user(`id`) on delete cascade on update cascade,
    unique key (`question`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table `answer` (
    `id` int not null auto_increment,
    `userid` int not null,
    `questionid` int not null,
    `answer` varchar(255) not null,
    primary key (`id`),
    foreign key (`userid`) references user(`id`) on delete cascade on update cascade,
    foreign key (`questionid`) references question(`id`) on delete cascade on update cascade,
    unique key (`questionid`, `answer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table `questionanswered` (
    `userid` int not null,
    `questionid` int not null,
    `answerid` int not null,
    `touserid` int not null,
    `correct` tinyint(1) not null,
    foreign key (`userid`) references user(`id`) on delete cascade on update cascade,
    foreign key (`questionid`) references question(`id`) on delete cascade on update cascade,
    foreign key (`answerid`) references answer(`id`) on delete cascade on update cascade,
    foreign key (`touserid`) references user(`id`) on delete cascade on update cascade,
    unique key (`userid`, `questionid`, `touserid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;