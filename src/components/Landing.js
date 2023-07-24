import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import './css/landing.css';

function Landing() {
const [selectedImages, setSelectedImages] = useState([]);
const [selectedExtension, setSelectedExtension] = useState('png');
const fileInputRef = useRef(null);

const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedImages([...selectedImages, ...files]);
};

const handleExtensionChange = (e) => {
    setSelectedExtension(e.target.value);
};

const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedImages([...selectedImages, ...files]);
};

const handleDragOver = (e) => {
    e.preventDefault();
};

const handleDownload = () => {
    if (selectedImages.length === 0) return;

    if (selectedImages.length === 1) {
    // Download a single image
    const file = selectedImages[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        const img = new Image();
        img.src = fileReader.result;

        img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to other image formats (excluding SVG)
        canvas.toBlob((blob) => {
            const downloadLink = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadLink;
            a.download = `${file.name.split('.')[0]}.${selectedExtension}`;
            a.click();
        }, `image/${selectedExtension}`);
        };
    };
    fileReader.readAsDataURL(file);
    } else {
    // Download as a zip file
    const zip = new JSZip();
    const promises = [];

    selectedImages.forEach((file, index) => {
        const promise = new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const img = new Image();
            img.src = fileReader.result;

            img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to other image formats (excluding SVG)
            canvas.toBlob((blob) => {
                resolve({ filename: `${file.name.split('.')[0]}_${index}.${selectedExtension}`, content: blob });
            }, `image/${selectedExtension}`);
            };
        };
        fileReader.readAsDataURL(file);
        });

        promises.push(promise);
    });

    Promise.all(promises).then((files) => {
        files.forEach((file) => {
        zip.file(file.filename, file.content);
        });

        zip.generateAsync({ type: 'blob' }).then((content) => {
        const downloadLink = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = downloadLink;
        a.download = 'images.zip';
        a.click();
        });
    });
    }
};
const handleFileInputClick = () => {
    fileInputRef.current.click();
};

return (
    <>
    <div className='made-by'>
        Made By <a target='_blank' href="https://abdulrhmanelsawy.github.io/abdelrhman-elsawy/"> Abdelrhman Elsawy </a>
    </div>
    <section className='landing'>
        <div className='container-fluid'>

            <div className='landing-content'>



                
            <div className='row'>

                                    
                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                        <div className='generalinputs'>
                        <select value={selectedExtension} onChange={handleExtensionChange}>
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="jpg">JPG</option>
                            <option value="gif">GIF</option>
                            <option value="bmp">BMP</option>
                            <option value="webp">WEBP</option>
                            {/* SVG option is removed from the select element */}
                            </select>
                            <button onClick={handleDownload}>Download Images</button>

                            <h1> Format Flipper </h1>

                        </div>

                    </div>







                    {selectedImages.map((image, index) => (
                    <div key={index} className='col-lg-4 col-md-4 col-sm-6 col-xs-12'>
                        <div className='image-container'>
                            
                            <img  src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} />
                            
                        </div>
                    </div>

                        ))}






                    <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>

                    <div id='fileInput' className='files-section' onDrop={handleDrop} onDragOver={handleDragOver}>
                    <input
                    type="file"
                    accept=".png, .jpeg, .jpg, .gif, .bmp, .webp"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    />
                    <button onClick={handleFileInputClick}>Select Images</button>
                    <p>Drag and drop images here to upload</p>
                    </div>

                    </div>

                    </div>


            </div>

        </div>
    </section>
    </>
);
}

export default Landing;
