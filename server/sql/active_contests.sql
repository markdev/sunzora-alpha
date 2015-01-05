SELECT * 
FROM public.contest 
WHERE contest.end_date <= current_timestamp;