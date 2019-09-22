select * from posts 
left join users on(posts.poster_id = users.user_id) 
where room_id IN(select admin_of from admin_access where user_id = $1);