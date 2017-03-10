package com.redforest.com.learningmixcolor;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {
    private CanvasView canvasView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        canvasView = (CanvasView) findViewById(R.id.canvasView);

    }
    public void clearCanvas(View v){
        canvasView.clearCanvas();
    }

    public void cambiaAzul(View view) {
        canvasView.cambiaColor(Color.BLUE);
    }

    public void cambiaAmarillo(View view) {
        canvasView.cambiaColor(Color.YELLOW);
    }

    public void cambiaRojo(View view) {
        canvasView.cambiaColor(Color.RED);
    }

    public void cambiaVerde(View view) {
        canvasView.cambiaColor(Color.GREEN);
    }

    public void cambiaMagenta(View view) {
        canvasView.cambiaColor(Color.MAGENTA);
    }
}
