drop table if exists `message`;
drop table if exists `story`;
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
    `description` text default '',
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
    `numberanswer` int default 4,
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

create table `message` (
    `id` int not null auto_increment,
    `type` enum('info', 'success', 'warning', 'error') not null,
    `message` varchar(255) not null,
    `touserid` int not null,
    primary key (`id`),
    foreign key (`touserid`) references user(`id`) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

create table `story` (
    `id` int not null auto_increment,
    `userid` int not null,
    `image` varchar(255) not null,
    `description` varchar(255) default "",
    primary key(`id`),
    foreign key (`userid`) references user(`id`) on delete cascade on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=latin1;