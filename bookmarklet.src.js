(function(){
    
    var resultArray = [];
    var wordArray = [];
    var elementCount = 0;
    var currentCount = 0;

    function traverseDom(n, callback) {
        callback(n);
        var n = n.firstChild;
        while (n) {
            traverseDom(n, callback);
            n = n.nextSibling;
        }
    }

    function processText(text) {
        var wordsInText = text.match(/\w+/g);
        if (wordsInText) {
            for (var i = 0; i < wordsInText.length; i++) {
                var elem = wordsInText[i];
                if (elem.length >= 4 && /\d/.test(elem) == false) {
                    wordArray.push(elem)
                }
            }
        }
    }

    function createDisplayFromArray() {

        // Create the container component for the display
        var container = document.createElement('div');
        container.id = "tagcloud_word_count"
        //Set container styles 
        container.setAttribute("style", "display: flex; z-index: 10000; align-items: center; justify-content: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; background-color: rgba(0, 0, 0, .4);")
        
        //create modal window
        var modal = document.createElement('div');
        modal.setAttribute("style", "width: 600px; height: 500px;background-color:white;")
        container.appendChild(modal);
        
        var firstrow = document.createElement('div');
        firstrow.setAttribute("style", "width:100%; height:25px;margin-top:5px;")
        modal.appendChild(firstrow);

        var closebutton = document.createElement('div');
        closebutton.innerText = "X"
        closebutton.setAttribute("style", "width: 15px; height: 15px; float: right; margin-right: 5px;")
        closebutton.onclick = function (e) {
            document.getElementById(container.id).remove()
        }
        firstrow.appendChild(closebutton);

        var wordcontainer = document.createElement('div');
        wordcontainer.setAttribute("style", "height: 470px; width: 100%; padding: 10px; overflow-y: scroll; display: flex; align-items: center; justify-content: space-around;flex-wrap:wrap; flex-direction: row;")
        modal.appendChild(wordcontainer);

        for (var i = 0; i < resultArray.length; i++) {
            var word = document.createElement('span');
            word.innerText = resultArray[i].word
            word.setAttribute('style', "color: " + (i % 3 === 0 ? "#00B4CC;" : i % 2 === 0 ? "#008C9E;" : "#005F6B;") + "font-size: " + (5 + (resultArray[i].count * 3)) + "px;")
            wordcontainer.appendChild(word)
        }

        document.body.appendChild(container)
    }

    function processDataArray () {
        wordArray.map(function(elem) {
            var found = null;
            if (resultArray.length > 0) {
                var found = resultArray.findIndex(function(wordObj) {
                    return wordObj.word.toLowerCase() === elem.toLowerCase()
                })
            }
            if (found && found > -1) {
                resultArray[found] = {
                    'word': resultArray[found].word,
                    'count': resultArray[found].count + 1
                }
            }
            else {
                resultArray.push({
                    'word': elem,
                    'count': 1
                })
            }
        })
        
        resultArray.sort(function(a, b) {
            var textA = a.word.toUpperCase();
            var textB = b.word.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        createDisplayFromArray();
    }

    traverseDom(document.body, function(n) {
        elementCount++;
    })

    traverseDom(document.body, function(n) {
        currentCount++;
        if (n.nodeType === 3) {
            var txt = n.data.trim();
            if (txt.length > 0) {
                processText(txt);
            } 
        }
        if (currentCount === elementCount) {
            processDataArray();
        }
    })

})();
