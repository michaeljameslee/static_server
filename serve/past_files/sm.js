// JavaScript Document
var SMCards = []; //Cards. Object array.
var channels = {}; //Social Media channels. Object.

//All other social media:
$(document).ready(function() {
  if($('#social_media').length) {
    
    //Twitter:
    if(sm_tw_ak != undefined && sm_tw_as != undefined && sm_tw_tk != undefined && sm_tw_ts != undefined && sm_tw_sn != undefined && 
      sm_tw_ak != '' && sm_tw_as != '' && sm_tw_tk != '' && sm_tw_ts != '' && sm_tw_sn != '' ) {
      var cb = new Codebird;
      cb.setConsumerKey(sm_tw_ak, sm_tw_as);
      cb.setToken(sm_tw_tk, sm_tw_ts);
      channels.twitter = { status: 'loading' };
      cb.__call(
        'statuses_userTimeline',
        {
          'screen_name': sm_tw_sn,
          'count': 4,
          'exclude_replies': true,
          'contributor_details': true,
          'include_rts': false
        },
        function (tweets) {
          // console.log(tweets);
          for(var tweet in tweets){
            if(typeof tweets[tweet] === 'object'){
              tcp = {
                      channel: 'twitter',
                      clink: 'https://twitter.com/' + tweets[tweet].user.screen_name + '/statuses/' + tweets[tweet].id_str,
                      //text: tweets[tweet].text.linkify(),
                      text: tweets[tweet].text,
                      time: moment(tweets[tweet].created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format('YYYYMMDDHH:mm:ss'),
                      title: '@' + sm_tw_sn
                    };
              SMCards.push(tcp);            
            }
          }
          channels.twitter.status = 'done';
          startCards();
        }
      );
    }
    
    //Facebook:
    if(sm_fb_pg != undefined && sm_fb_pg != '' && sm_fb_tk != undefined && sm_fb_tk != '') {
      channels.facebook = { status: 'loading' };
      fbp = $.ajax({
                     crossdomain: true,
                     data: 'fields=full_picture,link,message,created_time&limit=4&is_published=true&access_token=' + sm_fb_tk,
                     dataType: 'json',
                     url: 'https://graph.facebook.com/' + sm_fb_pg + '/posts',
                     type: 'GET'
                  });
      fbp.done(function(fbposts) {
        for(var post in fbposts.data) {
          if(fbposts.data[post].message != undefined)
            //regular Fb post
            tcp = {
                     channel: 'facebook',
                     clink: fbposts.data[post].link,
                     cover: fbposts.data[post].full_picture,
                     time: moment(fbposts.data[post].created_time).format('YYYYMMDDHH:mm:ss'),
                     title: sm_fb_pg,
                     text: fbposts.data[post].message
                  };
          else
            //odd. Event perhaps?
            tcp = {
                    channel: 'facebook',
                    clink: fbposts.data[post].link,
                    pic: fbposts.data[post].full_picture,
                    time: moment(fbposts.data[post].created_time).format('YYYYMMDDHH:mm:ss'),
                    title: sm_fb_pg,
                  };
          SMCards.push(tcp);
        }
        channels.facebook.status = 'done';
        startCards();
      });
      fbp.fail( function() {
        console.log('error while pulling facebook data');
        delete channels.facebook;
        startCards();
      });
    }
    
    //Instagram:
    if(sm_ig_us != undefined && sm_ig_us != '' && sm_ig_tk != undefined && sm_ig_tk != '') {
      channels.instagram = { status: 'loading' };
      ins = $.ajax({
                       crossdomain: true,
                       data: 'access_token=' + sm_ig_tk,
                       dataType: 'jsonp',
                       url: 'https://api.instagram.com/v1/users/self/media/recent/',
                       //url: 'https://api.instagram.com/v1/users/' + sm_ig_us + '/media/recent/',
                       type: 'GET'
                    });
      ins.done( function( insPics ) {
        for(var insPic in insPics.data) {
          tcp = {
                   channel: 'instagram',
                   clink: insPics.data[insPic].link,
                   pic: insPics.data[insPic].images.low_resolution.url,
                   time: moment(new Date(parseInt(insPics.data[insPic].created_time)*1000)).format('YYYYMMDDHH:mm:ss'),
                   title: sm_ig_us,
                   text: ''
                }
          SMCards.push(tcp);
        }
        channels.instagram.status = 'done';
        startCards();
      });
      ins.fail( function() {
        console.log('error while pulling instagram data');
        delete channels.instagram;
        startCards();
      });
    }
    
    
    //Pinterest:
    if(sm_pn_bd != undefined && sm_pn_bd != '' && sm_pn_tk != undefined && sm_pn_tk != '') {
      var pinFields = 'id%2Clink%2Cnote%2Curl%2Cboard%2Ccreator%2Cimage%2Coriginal_link%2Ccreated_at';
      channels.pinterest = { status: 'loading' };
      pp = $.ajax({
              crossdomain: true,
              data: 'access_token=' + sm_pn_tk + '&fields=' + pinFields,
              dataType: 'json',
              url: 'https://api.pinterest.com/v1/boards/' + sm_pn_bd + '/pins/',
              type: 'GET'
           });
      pp.done( function(pins) {
        pc = 0;
        for(var pin in pins.data) {
          if(pc < 4) {
            tcp = { channel: 'pinterest',
                    clink: pins.data[pin].url,
                    pic: pins.data[pin].image.original.url,
                    time: moment(pins.data[pin].created_at).format('YYYYMMDDHH:mm:ss'),
                    title: pins.data[pin].creator.first_name + ' ' + pins.data[pin].creator.last_name + '/' + pins.data[pin].board.name,
                    text: pins.data[pin].note
                  }
            SMCards.push(tcp);
          } else break;
          pc++;
        }
        channels.pinterest.status = 'done';
        startCards();
      });
      pp.fail( function() {
        console.log('error while pulling Pinterest data');
        delete channels.pinterest;
        startCards();
      });
    }
    
    //Google+:
    if(sm_g_tk != undefined && sm_g_tk != '' && sm_gp_pg) {
      channels.googlep = { status: 'loading' };
      gp = $.ajax({
                    crossdomain: true,
                    data: 'key=' + sm_g_tk,
                    dataType: 'json',
                    url: 'https://www.googleapis.com/plus/v1/people/' + sm_gp_pg + '/activities/public/',
                    type: 'GET'
           });
      gp.done( function(posts) {
        pc = 0;
        for(var post in posts.items) {
          if(pc < 4) {          
            tcp = { channel: 'google-plus',
                    clink: posts.items[post].object.url,
                    time: moment(posts.items[post].published).format('YYYYMMDDHH:mm:ss'),
                    title: posts.items[post].actor.displayName,
                    text: posts.items[post].object.content
                  };
            if(posts.items[post].object.attachments != undefined)
              tcp.cover = posts.items[post].object.attachments[0].image.url;
            SMCards.push(tcp);
          } else break;
          pc++;
        }
        channels.googlep.status = 'done';
        startCards();
      });
      gp.fail( function() {
        console.log('error while pulling Google+ data');
        delete channels.googlep;
        startCards();
      });
    }
    
    //YouTube:
    if(sm_g_tk != undefined && sm_g_tk != '' && sm_yt_ch != undefined && sm_yt_ch != '') {
      channels.youtube = { status: 'loading' };
      yl = $.ajax({
                    crossdomain: true,
                    data: 'part=contentDetails&forUsername=' + sm_yt_ch + '&key=' + sm_g_tk,
                    //data: { 'part': 'contentDetails', 'forUsername': ytChannel },
                    dataType: 'json',
                    url: 'https://www.googleapis.com/youtube/v3/channels',
                    type: 'GET'
                 });
      yl.done( function(data) {
        var cl = data.items['0'].contentDetails.relatedPlaylists.uploads;
        yv = $.ajax({
                      crossdomain: true,
                      data: 'part=snippet%2CcontentDetails%2Cstatus&playlistId=' + cl + '&key=' + sm_g_tk,
                      dataType: 'json',
                      url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                      type: 'GET'
                   });
        yv.done( function(videos) {
          //console.log(videos.items);
          var vc = 0;
          for(var vid in videos.items) {
            tcp = {
                     channel: 'youtube',
                     clink: 'https://youtu.be/' + videos.items[vid].contentDetails.videoId,
                     pic: videos.items[vid].snippet.thumbnails.high.url,
                     time: moment(videos.items[vid].snippet.publishedAt).format('YYYYMMDDHH:mm:ss'),
                     title: sm_yt_ch,
                     text: videos.items[vid].snippet.title
                  }
            SMCards.push(tcp);
            vc++;
            if(vc >= 4) break;
          }
          channels.youtube.status = 'done';
          startCards();
        });
        yv.fail( function() {
          console.log('error while pulling YouTube video data');
          delete channels.youtube;
          startCards();
        });
      });
      yl.fail( function() {
        console.log('error while pulling YouTube data');
        delete channels.youtube;
        startCards();
      });
    }
  }
});

function getInst(data) {
  // console.log(data);
}

function card(params) {
  
  //settings:
  if('pic' in params) {
    picCont = 'card-pic';
    contentType = '_sm2';
    params.img = params.pic;
  } else if('cover' in params) {
    picCont = 'card-cover';
    contentType = '_sm1';
    params.img = params.cover;
  } else {
    contentType = '_sm3';
  }
  switch(params.channel) {
    case 'facebook':
      params.fa = 'fa-facebook-square';
      break;
    case 'youtube':
      params.fa = 'fa-youtube-play';
      break;
    default:
      params.fa = 'fa-' + params.channel;
  }
  if(params.text == undefined) params.text = '';
  //cut very long texts at Facebook:
  if (Foundation.MediaQuery.atLeast('large')) {
    if(contentType == '_sm1' && params.text.length > 70) {
      nextword = params.text.indexOf(' ', 64);
      params.text = params.text.substring(0, nextword) + '...';
    }
  } else {
    if(contentType == '_sm1' && params.text.length > 50) {
      nextword = params.text.indexOf(' ', 50);
      params.text = params.text.substring(0, nextword) + '...';
    }
  }
  
  //build the card:
  var cCard = '<div class="card sm-card">' +
                '<div class="card-spacer">';
  //if(params.channel != 'twitter')
    cCard +=      '<a href="' + params.clink + '" target="_blank aria-label="Go to Social Media">';
    if (params.channel == 'youtube') {
      cCard +=  '<div class="' + picCont + '">' +
                  '<img class="' + picCont + '-img" alt="' + params.text + '" src="' + params.img + '" />' +
                  '<div class="card-youtube-overlay"></div>' +
                '</div>';
    } else {
      if (contentType == '_sm1' || contentType == '_sm2') {
        cCard +=  '<div class="' + picCont + '">' +
                    '<img class="' + picCont + '-img" alt="' + params.text + '" src="' + params.img + '" />' +
                  '</div>';
      }
    }
  cCard +=      '<div class="card-content">' + 
                  '<div class="content-text ' + contentType + '">';
  /*if(params.channel == 'twitter') {
      cCard +=      '<a href="' + params.clink + '" target="_blank">' +
                      '<h4>' + params.title + '</h4>' +
                    '</a>' +
                    params.text;
  } else */
    cCard +=        '<h4>' + params.title + '</h4>' +
                    params.text;
  cCard +=        '</div>' + 
                '</div>';
  //if(params.channel != 'twitter')
    cCard +=    '</a>';
  cCard +=      '<span class="card-sm-time">' + moment(params.time, 'YYYYMMDDHH:mm:ss').fromNow() + '</span>' +
                '<span class="card-sm-icon"><a href="' + params.clink + '" target="_blank"><i class="icon fa ' + params.fa + '"></i>' +
                '<span class="hideContent"> Go to Social Media </span></a></span>' +
              '</div>' +
            '</div>';
  return cCard;

}

function startCards() {
  //validate we've finished all social media loading:
  var alldone = true;
  for(var channel in channels) {
    if(channels[channel].status != 'done') alldone = false;
  }
  if(alldone == false) return;
  
  //Create the cardholder:
  $('#social_media').append('<div class="small-12 columns cardholder upspace-30"></div>');
  
  //Sort the cards:
  sortedCards = sortCards(SMCards);
    
  //Insert the cards:
  var cc = 0;
  for(var SMcard in sortedCards) {
    if(cc < 4) {
      var cCard = card(sortedCards[SMcard]);
      $('#social_media .cardholder').append(cCard);
    } else break;
    cc++;
  }
  
  //Slick the cards:
  $('#social_media .cardholder').slick({
    arrows: false,
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 682,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 982,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 1262,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  });
}

if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
        
        // Hashtags
        var hashtagPattern = /#(\w+)/g;

        return this
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>')
            .replace(hashtagPattern, '<a href="https://twitter.com/hastag/$&">$&</a>');
    };
}

function sortCards(cardsArr) {
  sortedCards = [];
  for(var card in cardsArr) {
    if(sortedCards.length == 0) {
      sortedCards.push(cardsArr[card]);
    } else {
      var fgSorted = false;
      for(var card2 in sortedCards) {
        if(cardsArr[card].time > sortedCards[card2].time) {
          sortedCards.splice(card2, 0, cardsArr[card]);
          fgSorted = true;
          break;
        }
      }
      if(!fgSorted)
        sortedCards.push(cardsArr[card]);
    }
  }
  return sortedCards;
}