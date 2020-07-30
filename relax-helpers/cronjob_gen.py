#   EVERY_DAY_NOON: '0 12 * * *',

def get_cron(input_time):
  cron_template = "{min} {hour} * * *"
  
  return cron_template.format(min=input_time.minute,hour=input_time.hour)
  

def cron_sched(num_minutes=79):
	now = datetime.datetime.today()
	start_time = datetime.datetime(now.year, now.month, now.day, now.hour+1)
	additional_times = [start_time + (datetime.timedelta(minutes=79)*x) for x in range(1,18+1)]
	print get_cron(start_time)
	for each_time in additional_times:
		print get_cron(each_time)