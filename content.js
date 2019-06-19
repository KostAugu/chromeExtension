chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var temp = document.getElementsByClassName("timeline-item-engagements");
      if (temp.length === 0) {
        alert("No company to scrap!");
      }      
      var engagements = [];
      // var htmlEngagement = "<html><body><style>p{margin-top:0;margin-bottom:1rem;display:block;}.card-footer{padding:0.75rem 1.25rem;background-color:rgba(0, 0, 0, 0.03);border-top:1px solid rgba(0, 0, 0, 0.125);}.title{font-size:1.45rem;font-weight:600;margin-bottom:0;}.card .title{font-size:1.1rem;color:#4f5f6f;}.date{float: right; font-size:1.45rem;font-weight:600;margin-bottom:0;}.card .date{font-size:1.1rem;color:#4f5f6f;}.card .card-header {background-image:none;background-color:#ffffff;align-items:center;display:flex;flex-direction:row;padding:0;border-radius:0;min-height:50px;border:none;}.header-block{padding:0.5rem 15px; display:flex; justify-content:space-between;width: 100%;}.card.card-info > .card-header{background-color:lightGrey;}.card-block{padding:15px;}.card-footer{background-color:#fafafa;}::-webkit-scrollbar-track{border-radius:0;}::-webki</style>";
      var htmlEngagement = "<html><body>";

      for (var i = 0; i < temp.length; i++) {
        var item = temp.item(i);
        var engagement = {};
        engagement.title = item.querySelector('.UIColumn-wrapper i18n-string').innerText;
        var html = '<div class="card card-info"><div class="card-header"><div class="header-block"><p class="title">';
        html += engagement.title;
        html += '</p><p class="date">';
        engagement.date = item.getElementsByClassName('timeline-header-timestamp').item(0).innerText;
        html += engagement.date;
        html += '</p></div></div><div class="card-block"><p>';

        if (i === temp.length - 1) {
          engagement.content = item.querySelector('[data-key="profileContentTimeline.timelineCreateSourceEvent.bodyText.noSource"]').innerText;
        } else {
          engagement.content = item.getElementsByClassName('private-expandable-text__container').item(0).innerText;
        }

        html += engagement.content;
        html += '</p></div><div class="card-footer"></div></div>';

        htmlEngagement += html;
        engagements.push(engagement);
      };

    

      // html2canvas(temp.item(0), {
      //   dpi: 300, // Set to 300 DPI
      //   scale: 3, // Adjusts your resolution
      //   onrendered: function(canvas) {
      //     var img = canvas.toDataURL("image/jpeg", 1);
      //     var doc = new jsPDF('L', 'px', [w, h]);
      //     doc.addImage(img, 'JPEG', 0, 0, w, h);
      //     doc.save('sample-file.pdf');
      //   }
      // });


      // var doc = new jsPDF();   
      // window.html2canvas = html2canvas;
      // doc.html("<h1>hello</h1>", {
      //   callback: function (doc) {
      //     doc.save();
      //   }
      // });

      htmlEngagement += "</body></html>";
      // console.log(htmlEngagement);
      // html2canvas(htmlEngagement).then(canvas => {
      //   let pdf = new jsPDF('p', 'mm', 'a4');
      //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
      //   pdf.save();
      // });


        // let pdf = new jsPDF('p', 'mm', 'a4');
        // var count = 15
        // for (var i = 0; i < engagements.length; i++) {
        //   pdf.text(20,count,engagements[i].title);
        //   pdf.text(60,count,engagements[i].date);          
        //   count += 15;
        //   pdf.text(20,count,engagements[i].content);
        //   count += 15;
        // }

        // pdf.save();
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

        ws["D3"] = {};
        add_to_sheet(ws, "D10");
        // ws["D10:D11"].t = "s";
        ws["D10"].v = ["a","b"];

        ws["E3"] = {};
        add_to_sheet(ws, "E3");
        ws["E3"].t = "s";
        ws["E3"].v = "issue1125";
        // ws[{c:0, r:0}] = cell;


        // var cell_ref = XLSX.utils.encode_cell({c:0,r:0});
        // ws[cell_ref] = cell;
        // var ws = XLSX.utils.encode_cell({c:0, r:0});
        // XLSX.utils.book_append_sheet(wb, ws, "Table");
        XLSX.writeFile(wb, "export.xlsx");


        // console.log(JSON.stringify(engagements[0]));
      // var pdf = new jsPDF('p', 'mm', 'a4');
      // pdf.fromTML(temp);
      // pdf.save('web.pdf');
      
      chrome.runtime.sendMessage({"message": "open_new_tab"});
    }
  }
);