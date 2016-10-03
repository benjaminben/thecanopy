'use strict';

var boosh = 'booooo\nooooooooooooooooosh';

(function () {

  var gs = {
    deck: document.getElementById('deck')
  };

  var Slide = function Slide(content) {
    var cont = document.createElement('div'),
        index = content.index;
    cont.id = 'slide_' + index;
    cont.className = 'slide';
    cont.index = content.index;

    cont.appendChild(content.img);

    var text_cont = document.createElement('span'),
        text = document.createElement('p');

    text_cont.id = 'slide_' + index + '_text_cont';
    text.id = 'slide_' + index + '_text';

    text_cont.className = 'slide-text-cont';
    text.className = 'slide-text';

    text.innerHTML = content.text;

    text_cont.appendChild(text);
    cont.appendChild(text_cont);

    cont.render = function () {
      // cont.className += ' entering'
      console.log('burf');
      gs.deck.appendChild(cont);
      gs.current_slide = slides[index];
      setTimeout(function () {
        window.addEventListener('wheel', wheelin);
      }, 1000);
    };

    cont.transition = function (forward) {
      if (forward && gs.current_slide === slides[slides.length - 1] || !forward && gs.current_slide === slides[0]) {
        return false;
      }

      cont.className += ' exiting';
      var next_slide = slides[forward ? index + 1 : index - 1];
      setTimeout(function () {
        gs.deck.removeChild(cont);
        cont.className = cont.className.replace(/(?:^|\s)exiting(?!\S)/, '');
        next_slide.render();
      }, 1000);
    };

    return cont;
  };

  var seeds = {
    cover: {
      background_img: './deck/slide_img_0.jpg',
      title_img: ''
    },
    slides: [{
      img_src: './deck/slide_img_0.jpg',
      text_src: './deck/0.txt'
    }, {
      img_src: './deck/slide_img_1.jpg',
      text_src: './deck/1.txt'
    }, {
      img_src: './deck/slide_img_2.jpg',
      text_src: './deck/2.txt'
    }, {
      img_src: './deck/slide_img_3.jpg',
      text_src: './deck/3.txt'
    }, {
      img_src: './deck/slide_img_4.jpg',
      text_src: './deck/4.txt'
    }, {
      img_src: './deck/slide_img_5.jpg',
      text_src: './deck/5.txt'
    }, {
      img_src: './deck/slide_img_6.jpg',
      text_src: './deck/6.txt'
    }, {
      img_src: './deck/slide_img_7.jpg',
      text_src: './deck/7.txt'
    }, {
      img_src: './deck/slide_img_8.jpg',
      text_src: './deck/8.txt'
    }]
  };

  var slides = seeds.slides.map(function (s, i) {
    console.log('blub');
    return new Promise(function (resolve, reject) {
      var content_prom = new Promise(function (res, rej) {
        var img = new Image();
        img.id = 'slide_img_' + i;
        img.src = s.img_src;
        img.onload = function () {
          res({ img: img, index: i });
        };

        // resolve obj containing img
      }).then(function (obj) {
        var req = new XMLHttpRequest();
        req.open('GET', s.text_src);
        req.send(null);

        req.onreadystatechange = function () {
          var DONE = 4,
              OK = 200;

          if (req.readyState === 4) {
            if (req.status === 200) {
              obj.text = req.responseText;
              resolve(new Slide(obj));
            } else {
              console.log('error: ' + req.status);
            }
          }
        };
        // resolve obj containing img_src and text_src
      });
    });
  });

  Promise.all(slides).then(function (ss) {
    slides = ss;
    intro.cover();
    // console.log(ss)
  });

  var intro = {
    cover: function cover() {
      var cover = document.createElement('div');
      cover.style.backgroundColor = 'pink';
      cover.id = 'cover';
      document.body.appendChild(cover);
      window.addEventListener('keydown', intro.enter);
      return cover;
    },
    enter: function enter(e) {
      if (e.keyCode === 32 || e.keyCode === 39) {
        document.body.removeChild(document.getElementById('cover'));
        init();
        window.removeEventListener('keydown', intro.enter);
      }
    }
  };

  function cover() {
    window.addEventListener('keydown', enter);
  }

  function init() {
    gs.current_slide = slides[0];
    slides[0].render();
    bindKeys();
  }

  function bindKeys() {
    window.addEventListener('wheel', wheelin);
    window.addEventListener('keydown', keyin);
  }
  // function mousein(e){

  // }
  function keyin(e) {
    if (e.keyCode === 32 || e.keyCode === 39) {
      gs.current_slide.transition(true);
    } else if (e.keyCode === 37) {
      gs.current_slide.transition(false);
    }
  }
  function wheelin(e) {
    if (e.deltaY > 55 || e.deltaY < -55) {
      if (e.deltaY > 55) {
        gs.current_slide.transition(true);
      } else if (e.deltaY < -55) {
        gs.current_slide.transition(false);
      }
      window.removeEventListener('wheel', wheelin);
    }
  }
})();
