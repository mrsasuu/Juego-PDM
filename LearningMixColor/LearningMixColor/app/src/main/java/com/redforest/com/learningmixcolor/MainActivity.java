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

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Menu;
import android.widget.FrameLayout;

public class MainActivity extends AppCompatActivity {

    private OverlayView overlayView;
    private ObjectViewLayout objectViewLayout;
    private ObjectView shape1;
    private ObjectView shape2;
    private ObjectView shape3;
    private int initialPositionX = 70;
    private int initialPositionY = 70;

    /*private CanvasView canvasView;
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
    }*/


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        float sizeFactor = 0.1f;
        objectViewLayout = new ObjectViewLayout(this);

        initialPositionX = 70;
        initialPositionY = 70;
        shape1 = new ObjectView(this, Color.RED, initialPositionX, initialPositionY, ShapeType.ARBITRARY_SHAPE, sizeFactor);
        objectViewLayout.addView(shape1, new FrameLayout.LayoutParams(150, 150));

        initialPositionX = 140;
        initialPositionY = 140;
        shape2 = new ObjectView(this, Color.BLUE, initialPositionX, initialPositionY, ShapeType.ARBITRARY_SHAPE, sizeFactor);
        objectViewLayout.addView(shape2, new FrameLayout.LayoutParams(150, 150));

        int initialPositionX = 210;
        int initialPositionY = 210;
        shape3 = new ObjectView(this, Color.GREEN, initialPositionX, initialPositionY, ShapeType.ARBITRARY_SHAPE, sizeFactor);
        objectViewLayout.addView(shape3, new FrameLayout.LayoutParams(150, 150));

        overlayView = new OverlayView(this);
        objectViewLayout.addView(overlayView, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        setContentView(objectViewLayout);

    }

    /*
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }*/


}
