<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Dashboard Baru</title>

</head>
<body>

<div class="menu">
<?php include 'menu.php';?>
</div>
    <iframe id="myIframeId" width="100%" height="600"></iframe>
    <button onclick="loadPage1()">Load Page 1</button>
    <button onclick="loadPage2()">Load Page 2</button>

    <script>
        function loadPage1() {
            var iframe = document.getElementById("myIframeId");
            iframe.src = "https://1drv.ms/x/c/d496409f748ecbb3/IQQylZKXL8RJTr5SCLTNOzM-Afliys_VCsQFPXqN4vU7Hg4?em=2&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True";
        }
        function loadPage2() {
            var iframe = document.getElementById("myIframeId");
            iframe.src = "home.php";
        }

    </script>

  
</body>
</html>







