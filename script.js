

// Constructeur d'echequier //

class Echiquier {
 
    /* Affichage de l'echiquier */
    afficher(id){
        
        var table = document.getElementById(id);
        table.innerHTML = ""; 
        for( var row = 0; row<8; row++){
            
            var tr = document.createElement("TR");
            tr.style.height = "4em";
            for(var col = 0; col<8; col++){
                var td = document.createElement("TD");
                
                td.setAttribute('data-ligne',8-row);
                td.setAttribute('data-colonne',col+1);
                
                td.style.width = "4em";
                td.style.textAlign = "center";
              
                td.setAttribute("data-couleur", (row + col)%2 == 0 ? "blanc" : "noir");
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

} 




