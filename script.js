const URL = "https://teachablemachine.withgoogle.com/models/aedR01yfj/";

let model;

async function loadModel(){

    try{

        model = await tmImage.load(
            URL + "model.json",
            URL + "metadata.json"
        );

        document.getElementById("status").innerHTML =
        "✅ AI Model Loaded Successfully";

    }catch(error){

        document.getElementById("status").innerHTML =
        "❌ Failed to Load Model";

        console.error(error);
    }
}

loadModel();

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(){

            preview.src = reader.result;
            preview.style.display = "block";
        }

        reader.readAsDataURL(file);
    }
});

async function analyzeWaste(){

    if(!preview.src){

        alert("Please upload an image first.");
        return;
    }

    if(!model){

        alert("Model is still loading.");
        return;
    }

    const prediction = await model.predict(preview);

    let highest = prediction[0];

    for(let i=1;i<prediction.length;i++){

        if(prediction[i].probability >
           highest.probability){

            highest = prediction[i];
        }
    }

    document.getElementById("resultBox").style.display =
    "block";

    document.getElementById("category").innerHTML =
    "Detected: " + highest.className;

    document.getElementById("confidence").innerHTML =
    "Confidence: " +
    (highest.probability * 100).toFixed(2) + "%";

    let advice = "";

    switch(highest.className.toLowerCase()){

        case "glass":
            advice = "✅ Recyclable. Place in a Glass Recycling Bin.";
            break;

        case "plastic":
            advice = "✅ Recyclable. Place in a Plastic Recycling Bin.";
            break;

        case "paper":
            advice = "✅ Recyclable. Place in a Paper Recycling Bin.";
            break;

        case "metal":
            advice = "✅ Recyclable. Place in a Metal Recycling Bin.";
            break;

        case "cardboard":
            advice = "✅ Recyclable. Flatten and place in Cardboard Recycling.";
            break;

        case "trash":
            advice = "⚠️ Non-Recyclable. Dispose in General Waste.";
            break;

        default:
            advice = "♻️ Follow Local Recycling Guidelines.";
    }

    document.getElementById("message").innerHTML = advice;
