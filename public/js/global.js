const contentMain = document.getElementById("content-main");


function preparePublication(e) {

    if (document.getElementById("dashboard") == null ) {

        document.getElementById("message-not").classList.remove("invisi");
        document.getElementById("message-not").classList.add ("visi");
        document.getElementById("form-create-display").classList.add("invisi");
        document.getElementById("form-create-display").classList.remove("visi");    
    } else {

        document.getElementById("message-not").classList.remove("visi");
        document.getElementById("message-not").classList.add("invisi");
        document.getElementById("form-create-display").classList.add("visi");
        document.getElementById("form-create-display").classList.remove("invisi");

    }
}


function createPublication(e) {
    
    
    
    
  const  firstImage = document.getElementById("input-file").files[0]; 
  const formData = new FormData();
  formData.append("firstImage", firstImage)

  axios
    .post(`/publication/ajax-create-publication`,formData,  {
        params: {
           title : document.getElementById("tag_name_input").value,
           description : document.getElementById("description").value,
           plant: document.getElementById("plant").value
        }  
    })
    .then(res => {
       
       const inner = "<div class='pub-pub'><a></a><div class='pub1'><a><div class='pub1A'>"+res.data.newpub.title+"<span>"+res.data.newpub.creationDate+"</span> </div> <div class='pub1B'>"+res.data.newpub.description+"</div> <div class='pub1C'> Plante associée :"+res.data.plant+"</div><div class='pub1C'>Auteur : "+res.data.email+"</div></a><a href='/publication/display-one/"+res.data.newpub._id+"'><div class='pub1D'>Voir toute cette publication</div></a><a></a></div><a><div class='pub2'> <img src='"+res.data.newpub.firstImage+"' onclick=\"myAgrandisseur('"+res.data.newpub.firstImage+"')\"></div></a></div>";
       document.getElementById("content-main").innerHTML = inner;
    })
    .catch(err => {
      console.error(err);
    });
}