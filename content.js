chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var temp = document.getElementsByClassName("timeline-item-engagements");
      if (temp.length === 0) {
        alert("No company to scrap!");
      }      
      var engagements = [];

      for (var i = 0; i < temp.length; i++) {
        var item = temp.item(i);
        var engagement = {};
        engagement.title = item.querySelector('.UIColumn-wrapper i18n-string').innerText;
        engagement.date = item.getElementsByClassName('timeline-header-timestamp').item(0).innerText;

        if (i === temp.length - 1) {
          engagement.content = item.querySelector('[data-key="profileContentTimeline.timelineCreateSourceEvent.bodyText.noSource"]').innerText;
        } else {
          engagement.content = item.getElementsByClassName('private-expandable-text__container').item(0).innerText;
        }
        engagements.push(engagement);
      };

      console.log(engagements);

        var ws_data = [
          [ "", "", "", "Report", "", "", "" ],
          [ "", "", "", "", "", "", "" ]
        ];

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Table");


        function range_add_cell(range, cell) {
          var rng = XLSX.utils.decode_range(range);
          var c = typeof cell == 'string' ? XLSX.utils.decode_cell(cell) : cell;
          console.log(rng, c);
          if(rng.s.r > c.r) rng.s.r = c.r;
          if(rng.s.c > c.c) rng.s.c = c.c;
        
          if(rng.e.r < c.r) rng.e.r = c.r;
          if(rng.e.c < c.c) rng.e.c = c.c;
          return XLSX.utils.encode_range(rng);
        }

        function add_to_sheet(sheet, cell) {
          sheet['!ref'] = range_add_cell(sheet['!ref'], cell);
        }
        var cellRow = 3;
        var cellCol = "D";

        for (var l = 0; l<engagements.length; l++) {
          ws[cellCol + cellRow] = {};
          add_to_sheet(ws, cellCol + cellRow);
          ws[cellCol + cellRow].t = "s";
          ws[cellCol + cellRow].v = engagements[l].title;
          cellRow++;
          
          ws[cellCol + cellRow] = {};
          add_to_sheet(ws, cellCol + cellRow);
          ws[cellCol + cellRow].t = "s";
          ws[cellCol + cellRow].v = engagements[l].date;
          cellRow++;
          
          ws[cellCol + cellRow] = {};
          add_to_sheet(ws, cellCol + cellRow);
          ws[cellCol + cellRow].t = "s";
          ws[cellCol + cellRow].v = engagements[l].content;
          cellRow = cellRow + 2;
        }

        XLSX.writeFile(wb, "export.xlsx");

      chrome.runtime.sendMessage({"message": "open_new_tab"});
    }
  }
);