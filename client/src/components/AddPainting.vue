<template>
    <html>
        <body>
            <form ref='uploadForm' 
            id='uploadForm' 
            action='/api/upload' 
            method='post' 
            encType="multipart/form-data">
                <input type="file" name="fileToUpload" />
                <input type='submit' value='Upload!' />
            </form>     
        </body>
    </html>
</template>

<script>

</script>