const CronJob = require( 'cron' ).CronJob,
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      helpers = require( __dirname + '/../helpers/helpers.js' );

module.exports = {
  scheduleJobs: function( bot ){
        let file = bot.file;
        if ( bot.interval ){
          let botInterval;

          for (const schedule in cronSchedules) {
            if ( cronSchedules[schedule] === bot.interval ){
              botInterval = schedule;
            }
          }
          
          if (Array.isArray( bot.interval )) {
            botInterval = "Custom array";
          }          

          if ( botInterval.length === 0 ){
            botInterval = bot.interval;
          } else {
            botInterval = helpers.capitalizeFirstLetter( botInterval.replace( /_/g, ' ' ) );
          }

          bot.interval_human = botInterval;

          console.log( `⌛ scheduling ${ bot.name } (${file}): ${ botInterval }` );

          if (Array.isArray(bot.interval)) {
            bot.cronjobs = [];
            bot.interval.forEach( function(cron_line) {
              const job = new CronJob( cron_line, function() { bot.script() } ); 
              bot.cronjobs.push(job);
              job.start();
              console.log( '📅 next run:', job.nextDates().fromNow() );
            });
            /*bot.cronjob = bot.cronjobs;*/
          } else {
            const job = new CronJob( bot.interval, function() { bot.script() } );
            bot.cronjob = job;

            job.start();
            console.log( '📅 next run:', job.nextDates().fromNow() );
          }
      }
  },
};