fileNavigate = (event) ->
    if event.keyCode == 13
        window.location.href = ("http://localhost:8080?dir=" + document.getElementById('directory-search').value)