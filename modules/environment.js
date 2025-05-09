render(context) {
    // Render the skybox first
    if (this.skybox) {
        console.log("Rendering skybox...");
        context.drawImage(this.skybox, 0, 0, context.canvas.width, context.canvas.height);
    } else {
        console.warn("Skybox not loaded or missing!");
    }

    // Render all geometric objects
    this.objects.forEach(object => {
        console.log("Rendering object:", object);
        context.fillStyle = object.color || '#ffffff';
        context.fillRect(
            object.x,
            object.y,
            object.width,
            object.height
        );
    });
}
