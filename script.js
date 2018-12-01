/*  *****1. Representation de l'echiquier ****** */

// Constructeur d'echequier //

class Echiquier {
    constructor(){
        /*pour le tableau on utilise les case =>td qu'on peut recuperer avec document.querySelector(): on utilse la methode cell*/
        this.pieceDeplacee=undefined;
        this.ligneDepart=undefined;
        this.colonneDepart=undefined;
        this.casesAutoriseees=[];
        this.tour="B";
        this.pieceMangee=undefined;
    }


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
        for(var i = 0; i < piecesLignes.length ; i++) {
            for(var k=0; k<8;k++){
                var celluleTD =this.cell(pionsLignes[i],k+1);
                var piece=new Piece('P',(pionsLignes[i]==7)?'N':'B');
                piece.ajoutDansTd(celluleTD);
            }
        }
        /*appel de la fonction activerDepl pour declancher le deplacement d'une pièce*/
        this.activerDepl();

    /*fin de la methode initialisation d'une partie*/   
    }


    /*methode recuperer une case dejà cliquée*/
    recupererTdClique(ec){
        var elt=ec.srcElement;
        while(elt){
            if(elt.nodeName=='TD'){
                return elt;
            }
            elt=elt.parentElement;
        }
        return undefined;
    /*fin recuperer une case cliquée*/
    }


    /*methode activer le deplacement d'une case*/
    activerDepl(){
        for(var ligne=1;ligne<=8;ligne++){
            for(var colonne=1; colonne<=8;colonne++){
                var celluleTD= this.cell(ligne,colonne);
                celluleTD.addEventListener('click',(ec)=>{/* interaction avec le clique*/
                    var tdCliquee=this.recupererTdClique(ec);
                                        
                    if(this.pieceDeplacee){
                        /*deposer la piece*/
                        var tdOrigne=this.cell(this.ligneDepart,this.colonneDepart);
                        var ligneArrivee=tdCliquee.getAttribute('data-ligne');
                        var colonneArrivee=tdCliquee.getAttribute('data-colonne');
                        // deplacement autorise;
                        if(this.pieceDeplacee.estDeplacementAutorise(this,this.ligneDepart,this.colonneDepart,ligneArrivee,colonneArrivee)){
                            console.log('on va mettre ' + this.pieceDeplacee);
                            console.log('deplacer de ' + this.ligneDepart + ','+this.colonneDepart + ' vers ' + ligneArrivee+','+colonneArrivee);

                            // voir si il y une pièce dans le TD cliqué
                            var couleurPieceMangee= tdCliquee.getAttribute('data-piece-couleur');
                            if((couleurPieceMangee) && tdCliquee.getAttribute('data-piece-type')){
                                this.pieceMangee = Piece.getPieceFromTd(tdCliquee);
                                var spanPieceMangee = tdCliquee.innerHTML;
                                if(couleurPieceMangee=='N'){
                                    var divPiece_N_Mangee= document.getElementById('piece_N_mangee');
                                    divPiece_N_Mangee.innerHTML+=spanPieceMangee;
                                } else{
                                    var divPiece_B_Mangee= document.getElementById('piece_B_mangee');
                                    divPiece_B_Mangee.innerHTML+=spanPieceMangee;

                                }

                            }

                            Piece.deplacerUneCase(tdOrigne,tdCliquee);

                            var coupEstIlLegal= this.roiEstEnEchec(this.tour);
                            if(coupEstIlLegal){
                                Piece.deplacerUneCase(tdCliquee, tdOrigne);
                                if(this.pieceMangee){
                                    this.pieceMangee.ajoutDansTd(tdCliquee); 
                                    var divPieceMangee=document.getElementById((this.pieceMangee.couleur=="B")? "piece_B_mangee": "piece_N_mangee");
                                    divPieceMangee.removeChild(divPieceMangee.lastElementChild);

                                }
                                
                            } else{
                                // promotion des pions: permet de modifier la piece Pion une sur les lignes (8 pour blanc et 1 pour N) avec n'inporte quel piece sauf le Roi
                                if(this.pieceDeplacee.type=="P"){
                                    if(this.pieceDeplacee.couleur=="B" && ligneArrivee==8 || this.pieceDeplacee.couleur=="N" && ligneArrivee==1){
                                        this.pieceDeplacee.type=document.querySelector("select").value;
                                        this.pieceDeplacee.ajoutDansTd(tdCliquee);
                                    }
                                }

                            

                                var couleurAdversaire=Echiquier.couleurInverse(this.tour);



                                var echec=this.roiEstEnEchec(couleurAdversaire);
                                if(echec){
                                    this.alerte("Echec aux " + ((couleurAdversaire=="B")?"Blancs" : "Noirs"));
                                }

                                var aucunCoupLegal=this.verifierAucunCoupLegal(couleurAdversaire);

                                if(aucunCoupLegal && echec){

                                    this.alerte("Echec et mat pour " + ((couleurAdversaire=="B")?"Blancs" : "Noirs"));

                                }else if(aucunCoupLegal && !echec){

                                    this.alerte("Pat ! match nul ");
                                }

                                // permet d'alterner les joueurs !! important
                                this.tour= couleurAdversaire;

                                /*tdCliquee.style.border = '2px solid red';*/                               

                            }
                        } else{
                            /* deplacement non autorise */
                            this.pieceDeplacee.ajoutDansTd(tdOrigne);                                                       
                        }

                        this.pieceDeplacee=undefined;
                        this.ligneDepart=undefined;
                        this.pieceMangee= undefined;
                        this.colonneDepart=undefined;
                        this.enleverSurbrillanceCases();
                        
                    }else{
                        
                        /*prendre la piece*/
                        this.ligneDepart= tdCliquee.getAttribute('data-ligne');
                        this.colonneDepart=tdCliquee.getAttribute('data-colonne');
                        this.pieceDeplacee =Piece.getPieceFromTd(tdCliquee);    
                        console.log('Piece a deplacer ' +this.pieceDeplacee );
                        this.casesAutorisees=this.pieceDeplacee.getDeplacementsAutorises(this,this.ligneDepart,this.colonneDepart);
                        this.surbrillerCases();
                    }
                });
            }
            
        }
    }
   
    cell(i, j){
        if(i<1 || j<1 || i>8 || j>8){
            return undefined;
        }
        //return this.cases[(i-1)*8 + (j-1)];
        var selecteur = '[data-ligne="'+i+'"][data-colonne="'+j+'"]';
        return document.querySelector(selecteur);
    }


    /* 2. Affichage de l'echiquier */
    afficher(id){
        
        var table = document.getElementById(id);
        table.innerHTML = ""; 
        for( var row = 0; row<8; row++){
            
            var tr = document.createElement("TR");
            tr.style.height = "4em";
            for(var col = 0; col<8; col++){
                var td = document.createElement("TD");
               
                // td.setAttribute("onclick", "cliqueCase(" + row + ", " + col + ")");
                td.setAttribute('data-ligne',8-row);
                td.setAttribute('data-colonne',col+1);
                // var c = this.cell(8-row, col+1);
                td.style.width = "4em";
                td.style.textAlign = "center";
                // c.td = td;
                //if(c.piece != undefined){
                
                //td.appendChild(txt);
                /*} else{ 
                    td.appendChild(document.createTextNode(" ")); 
                }*/
                td.setAttribute("data-couleur", (row + col)%2 == 0 ? "blanc" : "noir");
                //td.style.backgroundColor = (row + col)%2 == 0 ? "black" : "white";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }

    /*methode surbrillance: une on clique sur une piece elle nous donne les cases où on peut se deplacer*/
    surbrillerCases(){
        this.casesAutorisees.forEach((td,ind)=>{
            td.style.border='4px solid rgba(210,210,0,0.7)';
        });
    }

    enleverSurbrillanceCases(){
        this.casesAutorisees.forEach((td,ind)=>{
            td.style.border='0px';
        })
    }

    // methode qui recupère toutes les cases des pieces de la couleur donner en paramètre
    recupererCasesPieces(couleur){
        return document.querySelectorAll('[data-piece-couleur="'+couleur+'"]');
    }

    /* methode qui recupere la case Roi*/ 
    recupererCaseRoi(couleur){
        return document.querySelector('[data-piece-type="R"][data-piece-couleur="'+couleur+'"]');

    }

    // methode couleur inverse static

    static couleurInverse(couleur){
        if(couleur=="B"){
            return "N";
        }else{
            return "B";
        }
    }

    // methode Roi est en echèc
    roiEstEnEchec(couleur){
        var caseRoi = this.recupererCaseRoi(couleur);
        var casesPiecesAdversaire= this.recupererCasesPieces(Echiquier.couleurInverse(couleur));
        console.log(casesPiecesAdversaire);
        var coupsPossiblesAdversaire = [];
        casesPiecesAdversaire.forEach((tdAdversaire, index)=>{
            var pieceAdversaire = Piece.getPieceFromTd(tdAdversaire);
            var coupsPossiblePieceAdversaire = pieceAdversaire.getDeplacementsAutorises(this, tdAdversaire.getAttribute('data-ligne'),tdAdversaire.getAttribute('data-colonne'), true);
            coupsPossiblesAdversaire=coupsPossiblesAdversaire.concat(coupsPossiblePieceAdversaire);
        });
        
        return coupsPossiblesAdversaire.indexOf(caseRoi)>-1;
    }

    // methode qui recupere tout les coups possible poue la couleur passée en paramètre
    listerCoupsPossibles(couleur){
        var resultats = [];
        var casePieces=this.recupererCasesPieces(couleur);
        casePieces.forEach((tdPiece, index)=>{
            var p = Piece.getPieceFromTd(tdPiece);
            var casesPossibles = p.getDeplacementsAutorises(this, tdPiece.getAttribute('data-ligne'), tdPiece.getAttribute('data-colonne'), true);
            //console.log(p.type);
            //casesPossibles.forEach((td, ind) =>{ console.log(td.getAttribute('data-ligne') + ' ' + td.getAttribute('data-colonne'))});
            var coup = {caseDepart:tdPiece, casesPossibles:casesPossibles};
            if(casesPossibles.length>0){

                resultats.push(coup);
            }
        });
        return resultats;
    }

    //methode qui convertie un td en string ()

    convertieTdEnString(td){
        return td.getAttribute('data-ligne') + ' ' + td.getAttribute('data-colonne');
    }

    /* methode pour verifier echec et mat */

    verifierAucunCoupLegal(couleur){
        console.log('verifierAucunCoupLegal');
        var coupsPossibles = this.listerCoupsPossibles(couleur);
        var perdu = true;
        console.log(coupsPossibles.length);

        coupsPossibles.forEach((coupsMemeDepart, index)=>{
            console.log(coupsMemeDepart.casesPossibles.length);
            coupsMemeDepart.casesPossibles.forEach((caseArrivee,ind)=>{
                var pieceMangeable= Piece.getPieceFromTd(caseArrivee);
                Piece.deplacerUneCase(coupsMemeDepart.caseDepart, caseArrivee);
                if(this.roiEstEnEchec(couleur)){
                    console.log(this.convertieTdEnString(coupsMemeDepart.caseDepart) +' ' + this.convertieTdEnString(caseArrivee));
                    Piece.deplacerUneCase(caseArrivee, coupsMemeDepart.caseDepart);
                    if(pieceMangeable){
                        pieceMangeable.ajoutDansTd(caseArrivee); 
                    }
                }else{
                    Piece.deplacerUneCase(caseArrivee, coupsMemeDepart.caseDepart);
                    console.log('je vais sortire');
                    if(pieceMangeable){
                        pieceMangeable.ajoutDansTd(caseArrivee); 
                    }
                    // https://stackoverflow.com/questions/2509635/javascript-how-to-call-outer-functions-return-from-inner-function?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
                    return (perdu = false) ;
                }
            });

        });
        return perdu;
    }

    /* methode alerteEchec*/

    alerte(message){
        var alertP = document.getElementById("alerte");
        alertP.innerHTML=message;
        window.setTimeout(()=>{
            alertP.innerHTML="";
        }, 3000);
        var s = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(s);
    }

    // methode qui permet de sauvegarder  l'etat d'une partie dans le localStorage

    sauvegarderEtatPartie(){
        var listeTdPieces = document.querySelectorAll('[data-piece-type]');
        var pieceListe=[];
        listeTdPieces.forEach((td, ind)=>{
            var p = new Object();
            p.piecetype=td.getAttribute('data-piece-type');
            p.piececolor=td.getAttribute('data-piece-couleur');
            p.ligne=td.getAttribute('data-ligne');
            p.colonne=td.getAttribute('data-colonne');
            pieceListe.push(p);

        });
        localStorage.piecesMorts=JSON.stringify([]);
        this.sauvegarderCimetiere("piece_B_mangee");
        this.sauvegarderCimetiere("piece_N_mangee");
        localStorage.etatPartie= JSON.stringify(pieceListe); // stringify : convertir un Objet en string
    }



    // methode qui charge une partie sauvegardée
    chargerEtatPartie(){
        if(!(localStorage.etatPartie)) return;
        this.viderEchiquier();
        var etatPartie=JSON.parse(localStorage.etatPartie); // JSON.parse : convertir un string en Objet
        etatPartie.forEach((infoPiece, ind)=>{
            var tdPiece = this.cell(infoPiece.ligne, infoPiece.colonne);
            var p = new Piece(infoPiece.piecetype,infoPiece.piececolor);
            p.ajoutDansTd(tdPiece);
        });
        var cimetiere_Blanc=document.getElementById("piece_B_mangee");
        var cimetiere_Noir=document.getElementById("piece_N_mangee");
        cimetiere_Blanc.innerHTML="";
        cimetiere_Noir.innerHTML="";
        var piecesMortsSauvegardes=JSON.parse(localStorage.piecesMorts);
        piecesMortsSauvegardes.forEach((pms,ind)=>{
            var p = new Piece(pms.piecetype,pms.piececouleur);
            if(p.couleur=="B"){
                cimetiere_Blanc.innerHTML+=p.toString();
            }else{
                cimetiere_Noir.innerHTML+=p.toString();
            }
        });
    }


    // methode pour vider l'echiquier
    viderEchiquier(){
        var toutTd = document.querySelectorAll('[data-ligne][data-colonne]');
        toutTd.forEach((td, ind)=>{
            td.removeAttribute("data-piece-type");
            td.removeAttribute("data-piece-couleur");
            td.innerHTML="";

        });
    }

    // methode qui sauvegarde un cimetiere dont l'id est passer en paramètre
    sauvegarderCimetiere(idCimetiere){
        var piecesMorts= document.querySelectorAll('#' +idCimetiere+ ' span[data-span-piece-type][data-span-piece-couleur]');
        var piecesMortsSauvegardes = JSON.parse(localStorage.piecesMorts);
        piecesMorts.forEach((pm, ind)=>{
            var pieceMortInfo= new Object();
            pieceMortInfo.piecetype=pm.getAttribute('data-span-piece-type');
            pieceMortInfo.piececouleur=pm.getAttribute('data-span-piece-couleur');
            
            piecesMortsSauvegardes.push(pieceMortInfo);


        });
        localStorage.piecesMorts=JSON.stringify(piecesMortsSauvegardes);

    }    

} // ******fermeture de la classe Echiquier*******








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
        //var res= '<span class="piece" style="'+((this.couleur=='B')?'white':'black')+'">'+this.lettreEcrit+'</span>';
        return res;
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
    /*methode static pour recuperer une piece à partir du Td=>case*/

    static getPieceFromTd(td){
        var type=td.getAttribute('data-piece-type');
        var couleur=td.getAttribute('data-piece-couleur');
        if(type && couleur){
            var p= new Piece(type,couleur);
            return p;
            
        }
        /*si il n'y pas de pièce ds la case return unddefined*/
        return undefined;
    }

    /*methode pour deplacer une case à une autre case*/
    static deplacerUneCase(tdDepart,tdArrivee){
        //console.log(tdDepart);
        var piece=Piece.getPieceFromTd(tdDepart);
        tdDepart.removeAttribute('data-piece-type');
        tdDepart.removeAttribute('data-piece-couleur');
        tdDepart.innerHTML='';
        piece.ajoutDansTd(tdArrivee);


    }// fermeture 

    /* methode qui renvoi toutes les cases disponible du Roi et aussi les case de la même couleur, cellule à l'exterieur de l'echiquer*/
    static getCellulesDisponibleR(e,ligneDepart,colonneDepart){
        var res=[];
        res.push(e.cell(ligneDepart,colonneDepart+1));
        res.push(e.cell(ligneDepart-1,colonneDepart+1));
        res.push(e.cell(ligneDepart-1,colonneDepart));
        res.push(e.cell(ligneDepart-1,colonneDepart-1));
        res.push(e.cell(ligneDepart,colonneDepart-1));
        res.push(e.cell(ligneDepart+1,colonneDepart-1));
        res.push(e.cell(ligneDepart+1,colonneDepart));
        res.push(e.cell(ligneDepart+1,colonneDepart+1));
        return res;
    }// fermeture

    static getCellulesDisponibleC(e,ligneDepart,colonneDepart){
        var res=[];
        res.push(e.cell(ligneDepart+2,colonneDepart+1));
        res.push(e.cell(ligneDepart+1,colonneDepart+2));
        res.push(e.cell(ligneDepart-1,colonneDepart+2));
        res.push(e.cell(ligneDepart-2,colonneDepart+1));
        res.push(e.cell(ligneDepart-2,colonneDepart-1));
        res.push(e.cell(ligneDepart-1,colonneDepart-2));
        res.push(e.cell(ligneDepart+1,colonneDepart-2));
        res.push(e.cell(ligneDepart+2,colonneDepart-1));
        return res;
    }

    static getCellulesDisponibleT(e, ligneDepart,colonneDepart){
        var res=[];
        for(var colonne=colonneDepart+1;colonne<=8;colonne++){
            var cellule=e.cell(ligneDepart, colonne);
            res.push(cellule);
            if(Piece.getPieceFromTd(cellule)){
                break;
            }
        }
        for(var ligne=ligneDepart-1;ligne>=1;ligne--){
            var cellule=e.cell(ligne,colonneDepart);
            res.push(cellule);
            if(Piece.getPieceFromTd(cellule)){
                break;
            }
            
        }

        for(var colonne=colonneDepart-1;colonne>=1;colonne--){
            var cellule=e.cell(ligneDepart,colonne);
            res.push(cellule);
            if(Piece.getPieceFromTd(cellule)){
                break;
            }
        }

        for(var ligne=ligneDepart+1;ligne<=8;ligne++){
            var cellule=e.cell(ligne,colonneDepart);
            res.push(cellule);
            if(Piece.getPieceFromTd(cellule)){
                break;
            }
        }
        return res;
    }

    static getCellulesDisponibleDir(e,ligneDepart,colonneDepart,dLigne,dColonne){
        var res=[];
        for(var ligne=ligneDepart+dLigne, colonne=colonneDepart+dColonne; ligne>=1 && ligne<=8 && colonne>=1 && colonne<=8;ligne+=dLigne,colonne+=dColonne){
            var cellule=e.cell(ligne,colonne);
            res.push(cellule);
            if(Piece.getPieceFromTd(cellule)){
                break;
            }
        }
        return res;
    }

    static getCellulesDisponibleF(e, ligneDepart,colonneDepart){
        var res=[];
        res=res.concat(Piece.getCellulesDisponibleDir(e,ligneDepart,colonneDepart,1,1));
        res=res.concat(Piece.getCellulesDisponibleDir(e,ligneDepart,colonneDepart,-1,1));
        res=res.concat(Piece.getCellulesDisponibleDir(e,ligneDepart,colonneDepart,-1,-1));
        res=res.concat(Piece.getCellulesDisponibleDir(e,ligneDepart,colonneDepart,1,-1));

        return res;

    }

    static getCellulesDisponibleD(e,ligneDepart,colonneDepart){
        var res=[];
        res=Piece.getCellulesDisponibleF(e,ligneDepart,colonneDepart).concat(Piece.getCellulesDisponibleT(e,ligneDepart,colonneDepart));
        return res;
    }   
    
    static getCellulesDisponibleP(e,ligneDepart,colonneDepart,couleur){
        var direction=(couleur=='N')? -1: 1;
        var res=[];
        var celluleDevant=e.cell(ligneDepart+direction,colonneDepart);
        if(!Piece.getPieceFromTd(celluleDevant)){
            res.push(celluleDevant);    
        }
        if(couleur=='B' && ligneDepart==2 && !(e.cell(3,colonneDepart).getAttribute('data-piece-type')) && !(e.cell(4,colonneDepart).getAttribute('data-piece-type'))){
            res.push(e.cell(4,colonneDepart));
        } else if(couleur=='N' && ligneDepart==7 && !(e.cell(6,colonneDepart).getAttribute('data-piece-type')) && !(e.cell(5,colonneDepart).getAttribute('data-piece-type'))){
            res.push(e.cell(5,colonneDepart));
        }
        var celluleDiagGauche =e.cell(ligneDepart+direction,colonneDepart-1);
        if(celluleDiagGauche &&  Piece.getPieceFromTd(celluleDiagGauche)){
            res.push(celluleDiagGauche);
        }
        var celluleDiagDroite =e.cell(ligneDepart+direction,colonneDepart+1);
        if(celluleDiagDroite && Piece.getPieceFromTd(celluleDiagDroite)){
            res.push(celluleDiagDroite);
        }
        return res;
    }

    /* permet de filtrer les resultats de getcelluleDisponibleX*/
    static suprimerCellulesImpossibles(e,cellules,couleur){
        return cellules.filter((c)=>{
            /*suprimer des cellule à l'exterieur de l'echiquier*/
            if(!c){
                return false;
            }
            /*suprimer les cases qui contiennent les pièces de même couleur*/
            if(c.getAttribute('data-piece-couleur')==couleur){
                return false;
            }
            return true;
        });
    }

    /* permet de retrouver toutes les déplacements dispo pour une pièce : général pour toute les pièèces*/

    getDeplacementsAutorises(e, ligneDepart,colonneDepart,independentDeTour){
        independentDeTour= independentDeTour || false;
        if (! independentDeTour) {
            if(e.tour !=this.couleur){
                return [];
            }    
        }
        
        ligneDepart = +ligneDepart;
        colonneDepart = +colonneDepart
        var res=[];

        switch(this.type){
            case 'T':res=Piece.getCellulesDisponibleT(e,ligneDepart,colonneDepart);break;
            case 'C':res=Piece.getCellulesDisponibleC(e,ligneDepart,colonneDepart);break;
            case 'F':res=Piece.getCellulesDisponibleF(e,ligneDepart,colonneDepart);break;
            case 'D':res=Piece.getCellulesDisponibleD(e,ligneDepart,colonneDepart);break;
            case 'R':res=Piece.getCellulesDisponibleR(e,ligneDepart,colonneDepart);break;
            case 'P':res=Piece.getCellulesDisponibleP(e,ligneDepart,colonneDepart,this.couleur);break;

        }
        res=Piece.suprimerCellulesImpossibles(e,res,this.couleur);
        /*fonction qui permet de boucler sur un tableau*/
        /*res.forEach((c,ind)=>{console.log(c.getAttribute('data-ligne') + ' ' + c.getAttribute('data-colonne'))});*/
        return res;
    }

    /*verifie si un déplacement est autorisé pour toute les pièce pas de distinction de couleur*/
    estDeplacementAutorise(e,ligneDepart,colonneDepart,ligneArrivee,colonneArrivee){
        var coupsPossibles=this.getDeplacementsAutorises(e,ligneDepart,colonneDepart);
        /*find: fonction qui renvoi le 1er elt d'un tableau qui verie une condition
         renvoi undefined si aucun elt verifie la condition */
        return coupsPossibles.find((c)=>{
            return c.getAttribute('data-ligne')==ligneArrivee && c.getAttribute('data-colonne')==colonneArrivee;
        });
    }
}// fermeture de la classe Pièce


