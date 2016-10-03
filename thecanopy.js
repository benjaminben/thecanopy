'use strict';

var boosh = 'booooo\nooooooooooooooooosh';

(function () {

  var gs = {};

  var Slide = function(content){
    var cont = document.createElement('div'),
        index = content.index;
    cont.id = `slide_${index}`;
    cont.className = 'slide';
    cont.index = content.index;

    cont.appendChild(content.img);

    var text_cont = document.createElement('span'),
        text      = document.createElement('p');

    text_cont.id = `slide_${index}_text_cont`;
    text.id      = `slide_${index}_text`;

    text.innerHTML = content.text;

    text_cont.appendChild(text);
    cont.appendChild(text_cont);

    cont.render = function(){
      // cont.className += ' entering'
      document.appendChild(cont);
      setTimeout(function(){
        window.addEventListener('wheel', wheelin);
      }, 1000);
    }

    cont.transition = function(forward){
      cont.className += ' exiting';
      var next_slide = document.getElementById(`slide_${(forward ? index + 1 : index - 1)}`);
      setTimeout(function(){
        document.body.removeChild(cont);
        cont.className = cont.className.replace( /(?:^|\s)exiting(?!\S)/ , '' )
        next_slide.render();
      }, 1000);
    };

    return cont;
  };

  var seeds = {
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
    console.log('blub')
    return new Promise(function (resolve, reject) {
      var content_prom = new Promise(function (res, rej) {
        var img = new Image();
        img.id = `slide_img_${i}`;
        img.src = s.img_src;
        img.onload = function () {
          res({ img: img, index : i });
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
  console.log('blug')
  Promise.all(slides).then(ss => {
    // init(ss);
    console.log(ss)
  });

  function init(slides){
    gs.current_slide = slides[0];
    window.addEventListener('wheel', wheelin);
  }

  function wheelin(e){
    if( e.deltaY > 55 || e.deltaY < -55 ){
      if( e.deltaY > 55 ){
        gs.current_slide.transition(true);
      }
      else if( e.deltaY < -55 ){
        gs.current_slide.transition(false);
      }
      window.removeEventListener('wheel', wheelin);
    }
  }
})();

// // // creates a global "addWheelListener" method
// // // example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
// // (function(window,document) {

// //     var prefix = "", _addEventListener, support;

// //     // detect event model
// //     if ( window.addEventListener ) {
// //         _addEventListener = "addEventListener";
// //     } else {
// //         _addEventListener = "attachEvent";
// //         prefix = "on";
// //     }

// //     // detect available wheel event
// //     support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
// //               document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
// //               "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

// //     window.addWheelListener = function( elem, callback, useCapture ) {
// //         _addWheelListener( elem, support, callback, useCapture );

// //         // handle MozMousePixelScroll in older Firefox
// //         if( support == "DOMMouseScroll" ) {
// //             _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
// //         }
// //     };

// //     function _addWheelListener( elem, eventName, callback, useCapture ) {
// //         elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
// //             !originalEvent && ( originalEvent = window.event );

// //             // create a normalized event object
// //             var event = {
// //                 // keep a ref to the original event object
// //                 originalEvent: originalEvent,
// //                 target: originalEvent.target || originalEvent.srcElement,
// //                 type: "wheel",
// //                 deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
// //                 deltaX: 0,
// //                 deltaY: 0,
// //                 deltaZ: 0,
// //                 preventDefault: function() {
// //                     originalEvent.preventDefault ?
// //                         originalEvent.preventDefault() :
// //                         originalEvent.returnValue = false;
// //                 }
// //             };

// //             // calculate deltaY (and deltaX) according to the event
// //             if ( support == "mousewheel" ) {
// //                 event.deltaY = - 1/40 * originalEvent.wheelDelta;
// //                 // Webkit also support wheelDeltaX
// //                 originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
// //             } else {
// //                 event.deltaY = originalEvent.detail;
// //             }

// //             // it's time to fire the callback
// //             return callback( event );

// //         }, useCapture || false );
// //     }

// // })(window,document);

// (function(){

//   // function Slide(img_src, i){
//   //   this.img_src = img_src;
//   //   // this.text_src = text_src;
//   //   this.text = (function(){
//   //     var textReq = new XMLHttpRequest();
//   //     textReq.open('GET', '/deck/'+i+'.txt');
//   //     textReq.send(null);
//   //     textReq.onreadystatechange = textReqReady;
//   //   })();
//   // }

//   var slides = [],
//       req = new XMLHttpRequest();

//   var deck = {
//     el : (function(){return document.getElementById('deck')})(),
//     index : 0,
//     renderSlide : function(up){
//       console.log('blarf')
//       var i = deck.index = (up ? deck.index - 1 : deck.index + 1);
//       console.log(document.querySelector('img.current'));
//       document.querySelector('img.current')[0].className = '';
//       document.querySelector('img[data-index="'+i+'"]').className = 'current';

//       setTimeout(function(){
//         window.addEventListener('wheel', wheelin);
//       }, 666);
//     },
//   };
//     deck.up = deck.renderSlide(true),
//     deck.down = deck.renderSlide(false);

//   // var renderSlide = function(up){
//   // }

//   var init = function(total_slides) {
//     for( var i = 0; i < total_slides; i++ ){
//       var img = document.createElement('img');
//       img.src = '/deck/slide_img_'+i+'.jpg';
//       img.setAttribute('data-index', i)
//       img.className = ('slide-img' + (i === 0 ? ' current' : ''));
//       document.getElementById('deck').appendChild(img);
//     }

//     window.addEventListener('wheel', wheelin);
//     function wheelin(e){

//       if( e.deltaY > 55 || e.deltaY < -55 ){
//         if( e.deltaY > 55 ){
//           deck.down();
//         }
//         else if( e.deltaY < -55 ){
//           deck.up();
//         }
//         window.removeEventListener('wheel', wheelin);
//       }
//     }
//   };

//   var initReqReady = function(){
//     var req = this,
//         DONE = 4,
//         OK = 200;

//     if( req.readyState === DONE ){
//       if( req.status === OK ){
//         var parser = new DOMParser(),
//             doc = parser.parseFromString(req.response, 'text/html'),
//             as = doc.getElementsByTagName('a'),
//             total_slides = 0;

//         for( var fi = 0; fi < as.length; fi++ ) {
//           var href = as[fi].getAttribute('href');
//           if( href.indexOf('slide_img') > -1 ){
//             total_slides++;
//           }
//         }

//         init(total_slides);
//       }
//     }

//   //       // for( var si = 0; si < slides.length; si++ ){
//   //       //   slides[si].text_src = '/deck/' + text_files[si];
//   //       //   var textReq = new XMLHttpRequest();
//   //       //   textReq.open('GET', slides[si].text_src);
//   //       //   textReq.send(null);
//   //       //   textReq.onreadystatechange = textReqReady;
//   //       // }
//   //     }
//       else {
//         console.log('Error: ' + req.status, req);
//       }
//     }

//   req.open('GET', '/deck');
//   req.send(null);

//   req.onreadystatechange = initReqReady;
//   //   }
//   // }

//   // function textReqReady(){
//   //   var text_req = this,
//   //       DONE = 4,
//   //       OK = 200;

//   //   if( text_req.readyState === DONE ){
//   //     console.log('bust')
//   //     if( text_req.status === OK ){
//   //       return text_req.responseText;
//   //     }
//   //     else {
//   //       console.log('Error: ' + text_req.status, text_req);
//   //     }
//   //   }
//   // }


//   // var Slide = function(img_src, text){

//   // }

//   // var slides = [];

//   // for( var i = 0; i < 10; i++ ){
//   //   // new Slide('/deck/'+i+'');
//   //   var text_req = new XMLHttpRequest();
//   //   text_req.open('GET', '/deck/'+i+'.txt');
//   //   text_req.send(null);
//   //   text_req.onreadystatechange = textReqReady;
//   // }
// })();
