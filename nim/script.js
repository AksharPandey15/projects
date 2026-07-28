var aiMode = false;
var player = 1;
var itemRemoved = false;
var selectedHeap = null;
var reminderTimeout = null;
var gameOver = false;
var heapObj = {
  "heap-one": 3,
  "heap-two": 5,
  "heap-three": 7
};

var initGame = function() {
  if($("input[name='player-one']").val()) {
    var playerOneName = $("input[name='player-one']").val();
    $('#player-one').text(playerOneName);
  }
  if(aiMode === true) {
    $('#player-two').text("");
    $('#player-two').append("<i class='material-icons'>computer</i>");
  } else {
    if($("input[name='player-two']").val()){
      var playerTwoName = $("input[name='player-two']").val();
      $('#player-two').text(playerTwoName);
    }
  }
};

var resetGame = function() {
  $('h3').remove();
  $('.brain').remove();
  $('.item').show();

  clearTimeout(reminderTimeout);

  $('#player-one').removeClass('disabled');
  $('#player-two').addClass('disabled');

  player = 1;
  gameOver = false;
  heapObj['heap-one'] = 3;
  heapObj['heap-two'] = 5;
  heapObj['heap-three'] = 7;
  itemRemoved = false;
  selectedHeap = null;
};

var runWinSequence = function() {
  $('.switch-player').addClass('disabled');
  $('.reminder-msg').hide();
  clearTimeout(reminderTimeout);

  if(player === 1) {
      var playerName = $('#player-one').text();
    } else {
      var playerName = $('#player-two').text();
    }

  setTimeout(function () {
    $('.item').fadeOut(500);
    setTimeout(function() {
      $('.heap-one').hide();
      $('.heap-two').hide();

      console.log("player is: ", player);
      if(player === 1 || player === 2 && aiMode === false) {
        $('.heap-one').append("<img src='img/winner.png' class='brain responsive-img'>");
        $('.heap-two').append("<h3 class='win-msg'>" + playerName + " wins!</h3>");
      } else {
        $('.heap-one').append("<img src='img/ai-brain.png' class='brain responsive-img'>");
        $('.heap-two').append("<h3 class='win-msg'>The AI beat you...</h3>");
      }
      $('.heap-one').fadeIn("slow");
      $('.heap-two').fadeIn("slow");
    }, 750);
  }, 1000);
};

var aiComputeMove = function() {
  var heapArray = [];
  var itemsToRemove = {
    "heap-index": null,
    "quantity": null
  };

  for(heap in heapObj) {
      heapArray.push(heapObj[heap]);
  }

  var largeHeap = 0;
  for(let i = 0; i < heapArray.length; i++) {
    if(heapArray[i] > 1) {
      largeHeap++;
    }
  }

  if(largeHeap <= 1) {
    var numHeaps = 0;
    for(let i = 0; i < heapArray.length; i++) {
      if(heapArray[i] > 0) {
        numHeaps++;
      }
    }
    var maxHeap = Math.max(...heapArray);
    var maxHeapIndex = heapArray.indexOf(maxHeap);
    itemsToRemove["heap-index"] = maxHeapIndex;

    if(numHeaps % 2 === 1) {
      itemsToRemove["quantity"] = maxHeap - 1;
    } else {
      itemsToRemove["quantity"] = maxHeap;
    }
    return itemsToRemove;
  }

  var binarySum = heapArray.reduce(function(x, y) { return x^y;});
  var heapSums = heapArray.map(function(heapSize) {return heapSize ^ binarySum});

  for(let i = 0; i < heapSums.length; i++) {
    if(heapSums[i] < heapArray[i]) {
      itemsToRemove["heap-index"] = i;
      itemsToRemove["quantity"] = heapArray[i] - heapSums[i]; 
      var move = 'Move: Take ' + (heapArray[i] - heapSums[i]) + ' from heap ' + (i+1);
    } else {
      var index = heapArray.indexOf(Math.max(...heapArray)) + 1;
    }
  }

  if(!itemsToRemove["quantity"]) {
    itemsToRemove["heap-index"] = heapArray.indexOf(Math.max(...heapArray));
    itemsToRemove["quantity"] = 1;
  }

  return itemsToRemove;
}

var aiPlayTurn = function() {

  var maxHeaps = { "heap-one": 3,
                   "heap-two": 5,
                   "heap-three": 7
  };

  var itemIds = { "heap-one": ["h1-1", "h1-2", "h1-3"],
                  "heap-two": ["h2-1", "h2-2", "h2-3", "h2-4", "h2-5"],
                  "heap-three": ["h3-1", "h3-2", "h3-3", "h3-4", "h3-5", "h3-6", "h3-7"]
                };

  var itemsToRemove = aiComputeMove();
  console.log("Computer will remove: ", itemsToRemove);

  var heapKeys = Object.keys(heapObj);
  var heapName = heapKeys[itemsToRemove["heap-index"]];
  var quantityToRemove = itemsToRemove["quantity"];
  var quantityRemoved = 0;
  var itr = 0;
  var idString = '';

  while(quantityRemoved < quantityToRemove) {
    idString = "#" + itemIds[heapName][itr];
    if($(idString).css("display") != 'none') {
      $(idString).triggerHandler("click");
      quantityRemoved++;
    }
    if(itr > maxHeaps[heapName]) {
      itr = 0;
    }
    itr++;
  }

  var heapSum = 0;
  for(heap in heapObj) {
    heapSum += heapObj[heap];
  }

  if(!gameOver) {
    player = 1;
    $('#player-two').addClass('disabled');
    $('#player-one').removeClass('disabled');
  }
};

var switchPlayer = function() {
  $('.reminder-msg').hide();
  clearTimeout(reminderTimeout);
  console.log("itemRemoved= ", itemRemoved);
  if(!itemRemoved) {
    M.toast({html: 'You have to remove at least one item!', classes: 'rounded'});
  } else {
    if(!gameOver) {
      if(player === 1) {
        player = 2;
        $('#player-one').addClass('disabled');
        $('#player-two').removeClass('disabled');
      } else {
        player = 1;
        $('#player-two').addClass('disabled');
        $('#player-one').removeClass('disabled');
      }
    }
  }

  itemRemoved = false;

  setTimeout(function() {
    if(aiMode && player === 2 && !gameOver) {
      aiPlayTurn();
      itemRemoved = false;
    }
  }, 1000);
};

var removeItem = function() {
  M.Toast.dismissAll();

  if(!itemRemoved) {
    selectedHeap = $(this).parent().attr('id');
    itemRemoved = true;
    
    if(!aiMode || aiMode && player !== 2) {
      reminderTimeout = setTimeout(function() {
        $('.reminder-msg').fadeIn(1000);
        setTimeout(function() {
        $('.reminder-msg').fadeOut(500);
        }, 3000);
      }, 3000);
    }
  }

  if($(this).parent().attr('id') === selectedHeap) {
    console.log(heapObj[selectedHeap]);
    heapObj[selectedHeap]--;
    $(this).hide();

    var heapSum = 0;
    for(heap in heapObj) {
      heapSum += heapObj[heap];
    }
    console.log("heapSum =", heapSum);

    if(heapSum === 1 && !gameOver) {
      gameOver = true;
      runWinSequence();
    }
  } else {
    M.toast({html: 'You may only remove items from one heap!', classes: 'rounded'});
  }
};

$(document).ready(function() {
  $('.reminder-msg').hide();
  $('.modal').modal({'opacity': 0.75});

  $(".game-mode").on("click", function() {
    if($(this).hasClass("two-player")) {
      $(this).css("border","2px solid black");
      $(".computer").css("border","none");
      aiMode = false;
      $('.players').remove();
      $('.modal-content').append("<label class='players'>Player 1 Name:<input type='text' name='player-one'></label><label class='players'>Player 2 Name:<input type='text' name='player-two'></label>");
    } else {
      $(this).css("border","2px solid black");
      $(".two-player").css("border","none");
      aiMode = true;
      $('.players').remove();
      $('.modal-content').append("<label class='players'>Your Name:<input type='text' name='player-one'>");
    }
  });
  
  $('.modal').modal('open');

  $("a.modal-close").on("click", initGame);
  $(".item").on("click", removeItem);
  $(".reset").on("click", resetGame);
  $(".switch-player").on("click", switchPlayer);
  $('.tooltipped').tooltip();
  $('.sidenav').sidenav();
});