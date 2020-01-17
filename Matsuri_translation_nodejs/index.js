const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;
const fs = require('fs');

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

const window = driver.manage().window();



const openPage = async url => {
  await window.setRect({width: 640, height: 400, x: 0, y: 0})
  return await driver.get(url)
}


const modifyTweet = async () => {
  let currentUrl = await driver.getCurrentUrl();  
  await driver.executeScript(`
    return $('.js-tweet-text-container').last().parents(".permalink-tweet-container,.js-stream-item").offset().top+$('.js-tweet-text-container').first().parents(".permalink-tweet-container,.js-stream-item").height();
  `)
  if (currentUrl.indexOf("/status/") > -1) {
    await driver.executeScript(`
      $(".PermalinkOverlay-modal").attr("style","border-radius: 0;    min-height: 0;    margin-bottom: 0;    position: absolute;    top: 0 !important;    left: 0;    width: 640px;    margin-left: 0;");
      $(".PermalinkOverlay").css("overflow","hidden");
      $(".permalink-tweet").css("border-radius",0);
      $(".permalink").css("border",0);
      $(".permalink-container").css("width","640px");
      $('.PermalinkOverlay-modal')[0].scrollIntoView()
    `)
  } else {
    await driver.executeScript(`
      $(".ProfileTimeline").css("width","640px");
      $(".ProfileTimeline").css("position","absolute");
      $(".ProfileTimeline").css("z-index","100000");
      $(".ProfileTimeline").css("top",(0)+"px");
      $(".ProfileTimeline").css("top",(-$(".ProfileTimeline").offset().top)+"px");
      $(".ProfileTimeline").css("left",(0)+"px");
      $(".ProfileTimeline").css("left",(-$(".ProfileTimeline").offset().left)+"px");
      $(".stream-item").css("border","0");
      $(".tweet").css("padding-left","40px");
      $(".tweet").css("padding-right","40px");
    `)
  }
  await driver.executeScript(`
    $(".js-display-this-media").click();
    $("#ancestors").css("margin","0");
    $("body").css("overflow","hidden");
    $('.follow-button').css('display','none');
    $(".tweet").css("background-color","#fff");
    $(".media-tags-container").remove();
  `)
  if (currentUrl.indexOf("/status/") > -1) {
    await driver.executeScript(`
      var timestamp = document.querySelector('.permalink-header .time > a > span').getAttribute('data-time-ms');
      var now = new Date(timestamp - 0);
      var year = now.getFullYear();
      var month = 1 + now.getMonth();
      var day = now.getDate();
      var hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      var time = hours + ":" + minutes;
      var str = year + "年" + month + "月" + day + "日，" + time;
      document.querySelector('.client-and-actions .metadata > span').innerText = str;
    `)
  }
};

const scrollPageToTweet = async fast => {
  if (fast) {
    let height = await driver.executeScript(`
      return $('.js-tweet-text-container').first().parents(".permalink-tweet-container,.js-stream-item").offset().top+$('.js-tweet-text-container').first().parents(".permalink-tweet-container,.js-stream-item").height();
    `)
    await window.setRect({width: 640, height, x: 0, y: 0});
  } else{
    let height = await driver.executeScript(`
      return $('.js-tweet-text-container').last().parents(".permalink-tweet-container,.js-stream-item").offset().top+$('.js-tweet-text-container').last().parents(".permalink-tweet-container,.js-stream-item").height();
    `)
    await window.setRect({width: 640, height, x: 0, y: 0});
  }
}

const saveScreenshots = async () => {
  let filename = new Date().getTime() + '';
  if not isdir('Matsuri_translation/frontend/cache'):
      mkdir('Matsuri_translation/frontend/cache')
  
  
  #print(self.driver.find_element_by_css_selector('iframe').get_attribute('innerHTML'))
  self.driver.save_screenshot(
      f'Matsuri_translation/frontend/cache/{filename}.png')
  # pngquant.quant_image(f'Matsuri_translation/frontend/cache/{filename}.png', f'Matsuri_translation/frontend/cache/{filename}.png')
  
  clipinfo = self.driver.execute_script('''
      var ls=[];
      $('.js-tweet-text-container').each(function(i,obj){
          var item={
              top:$(obj).offset().top,
              bottom:$(obj).offset().top+$(obj).height(),
              text:$(obj).text().trim(),
              path:$(obj).parents(".tweet").attr("data-permalink-path"),
              blockbottom:$(obj).parents(".permalink-tweet-container,.js-stream-item").offset().top+$(obj).parents(".permalink-tweet-container,.js-stream-item").height()
          }
          ls.push(item)
      });
      $(".tco-ellipsis").remove();
      $(".Emoji--forText").each(function(i,obj){$(obj).replaceWith($(obj).attr("alt"))});
      $('.js-tweet-text-container').each(function(i,obj){
          ls[i].text=$(obj).text().trim();
      });
      return JSON.stringify(ls);
  ''')
  return filename + "|" + clipinfo  
}

setTimeout(async () => {
  await openPage('https://twitter.com/7216_2nd/status/1124189990588637184')
  await modifyTweet();
  await scrollPageToTweet();


}, 0);