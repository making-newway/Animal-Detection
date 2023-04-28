async function postData(url, formdata) {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formdata, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function postImage() {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');

    if(fileField == null || fileField.files.length == 0) alert('Please select a file')
    else {
        formData.append("image", fileField?.files[0]);

        postData("/predict", formData).then((data) => {
            console.log(data);
            document.getElementById("className").innerText = data?.class;
        });
    }
}

function readURL() {
    const input = document.getElementById("imgInput");
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            document.getElementById("imgDisplay").innerHTML = "";
            document.getElementById("imgDisplay").appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
} 