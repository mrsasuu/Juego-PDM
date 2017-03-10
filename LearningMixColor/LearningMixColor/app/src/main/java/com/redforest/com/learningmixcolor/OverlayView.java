package com.redforest.com.learningmixcolor;


import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;

/**
 * Created by Sasu on 10/03/2017.
 */
@SuppressLint("DrawAllocation")
public class OverlayView extends View {

    public OverlayView(Context context) {
        super(context);
    }

    public OverlayView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public OverlayView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Bitmap bitmap = Bitmap.createBitmap(getWidth(), getHeight(), Config.ARGB_8888);
        Canvas canvasBitmap = new Canvas(bitmap);
        ViewGroup viewGroup = (ViewGroup) getParent();
        for (int i = 0; i < viewGroup.getChildCount() - 1; i++) {

            ObjectView objectView = (ObjectView) viewGroup.getChildAt(i);
            canvasBitmap.save();
            canvasBitmap.translate(objectView.getTranslationX(), objectView.getTranslationY());
            objectView.onDrawEx(canvasBitmap);
            canvasBitmap.restore();
        }
        float left = 0;
        float top = 0;
        canvas.drawBitmap(bitmap, left, top, new Paint());

    }

}
