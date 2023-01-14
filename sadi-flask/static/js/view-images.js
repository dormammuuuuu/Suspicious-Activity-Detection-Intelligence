window.onload = () => {
    const user = window.location.pathname.split('/')[2].replace('%20', ' ');
    fetch('/users/' + user + '/images')
        .then(response => response.json())
        .then(data => {
            // data is the list of image names
            console.log(data);
            data.forEach(img => {
                // create an image element for each image
                const image = document.createElement("img");
                image.src = '/users/' + user + '/' + img;
                image.alt = img;
                // append the image element to the container
                document.getElementById("image-container").appendChild(image);
            })
        })
}