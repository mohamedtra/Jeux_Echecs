

// Constructeur d'echequier //

class Echiquier {

    /*  fonction initialisation d'une partie */
    /*debut*/
    initialiserPartie(){
        /*boucle */
        var symbolesPiecesSaufPion=['T','C','F','D','R','F','C','T'];
        var piecesLignes = [8,1];
        for(var i = 0; i < piecesLignes.length ; i++) {
            for(var k=0; k<8;k++){
                var celluleTD =this.cell(piecesLignes[i],k+1);
                var piece=new Piece(symbolesPiecesSaufPion[k],(piecesLignes[i]==8)?'N':'B');
                piece.ajoutDansTd(celluleTD);
            }
        }

        var pionsLignes=[7,2];
        for(var i = 0; i < pionsLignes.length ; i++) {
            for(var k=0; k<8;k++){
                var celluleTD =this.cell(pionsLignes[i],k+1);
                var piece=new Piece('P',(pionsLignes[i]==7)?'N':'B');
                piece.ajoutDansTd(celluleTD);
            }
        }
        
    /*fin de la methode initialisation d'une partie*/   
    }

 
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

    // 

    cell(i, j){
        if(i<1 || j<1 || i>8 || j>8){
            return undefined;
        }
        var selecteur = '[data-ligne="'+i+'"][data-colonne="'+j+'"]';
        return document.querySelector(selecteur);
    }



} 




/* *****Répresentation des pièces******* */


/*debut de la classe Piece*/
class Piece{
    /* Constructeur de pièces */
    constructor(t,c){
        this.type=t;
        this.couleur=c;
        this.lettreEcrit="";
        
    }

    /* representation textuelle des pièces */
    toString(){
        if(this.type=='P' && this.couleur=='B'){
            this.lettreEcrit="p";
        } else if(this.type=='P' && this.couleur=='N'){
            this.lettreEcrit="o";
        } else if(this.type=='R' && this.couleur=='B'){
            this.lettreEcrit="k";
        }else if(this.type=='R' && this.couleur=='N'){
            this.lettreEcrit="l";
        }else if(this.type=='D' && this.couleur=='B'){
            this.lettreEcrit="q";
        }else if(this.type=='D' && this.couleur=='N'){
            this.lettreEcrit="w";
        }else if(this.type=='C' && this.couleur=='B'){
            this.lettreEcrit="n";
        }else if(this.type=='C' && this.couleur=='N'){
            this.lettreEcrit="m";
        }else if(this.type=='F' && this.couleur=='B'){
            this.lettreEcrit="b";
        }else if(this.type=='F' && this.couleur=='N'){
            this.lettreEcrit="v";
        }else if(this.type=='T' && this.couleur=='B'){
            this.lettreEcrit="r";
        }else if(this.type=='T' && this.couleur=='N'){
            this.lettreEcrit="t";
        }

        var res= '<span class="piece" data-span-piece-type="'+this.type+'" data-span-piece-couleur="'+this.couleur+'">'+this.lettreEcrit+'</span>';
        return res ;
    }

    /*methode pour verifier si deux pièces sont equivalentes*/
    equals(piece){
        return this.type==piece.type && this.couleur==piece.couleur;
    }// fermeture comparaison entre deux pièce

    /*methode ajout dans le TD => case*/

    ajoutDansTd(td){
        td.setAttribute('data-piece-type',this.type);
        td.setAttribute('data-piece-couleur',this.couleur);
        //var couleur = this.couleur == 'B' ? "white" : "black";
        //var txt = document.createTextNode(c.piece.type);
        //td.style = "width: 3em; text-align: center; font-family: sans-serif; color: " + couleur;
        //td.appendChild(txt);
        td.innerHTML = this.toString();
    }
}