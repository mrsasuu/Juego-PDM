package com.redforest.com.learningmixcolor;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;

/**
 * Created by Sasu on 10/03/2017.
 */

public class ObjectViewLayout extends FrameLayout {

    public ObjectViewLayout(Context context) {
        super(context);
    }

    public ObjectViewLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ObjectViewLayout(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getActionMasked()) {
            case MotionEvent.ACTION_UP:
                for (int i = 0; i < getChildCount() - 1; i++) {
                    ObjectView objectView = (ObjectView) getChildAt(i);
                    objectView.setTouched(false);
                }
            case MotionEvent.ACTION_DOWN:
            case MotionEvent.ACTION_MOVE:

                for (int i = 0; i < getChildCount() - 1; i++) {
                    ObjectView objectView = (ObjectView) getChildAt(i);
                    if (objectView.isTouched()) {
                        objectView.setTranslationX(event.getX() - objectView.getWidth() / 2);
                        objectView.setTranslationY(event.getY() - objectView.getHeight() / 2);

                        break;
                    }
                }
        }
        // THE NEXT LINE REPRESENTS/CALLS THE OVERLAYVIEW
        getChildAt(getChildCount() - 1).invalidate();
        // THIS LINE SETS/CHECKS MIXED COLORS TO USE THE WAY YOU MAY WANT
        new Colorize().setColorToPen(getColorFromMiddleOfThisObject());
        return true;
    }

    public int getColorFromMiddleOfThisObject() {
        Bitmap returnedBitmap = getBitmapFromView(this);
        int pixel = returnedBitmap.getPixel(this.getWidth()/2, this.getHeight()/2);
        Log.i("TEST", "Pixel value ObjectViewLayout: "+pixel);
        return pixel;
    }

    private Bitmap getBitmapFromView(View view) {
        Bitmap returnedBitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(returnedBitmap);
        Drawable backgroundDrawable = view.getBackground();
        if (backgroundDrawable != null)
            backgroundDrawable.draw(canvas);
        else
            // does not have background drawable, then draw dark grey background
            // on the canvas to be able to detect it.
            canvas.drawColor(Color.DKGRAY);
        view.draw(canvas);
        return returnedBitmap;
    }

}