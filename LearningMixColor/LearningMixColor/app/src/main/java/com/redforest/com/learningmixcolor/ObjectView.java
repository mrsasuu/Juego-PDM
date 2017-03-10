package com.redforest.com.learningmixcolor;

import java.util.Random;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff.Mode;
import android.graphics.PorterDuffXfermode;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

public class ObjectView extends View {

    private Paint paint;
    private boolean isTouched;
    private ShapeType shapeType;
    private float shapeSizeFactor;

    public ObjectView(Context context, AttributeSet attrs, int defStyle) {super(context, attrs, defStyle);}
    public ObjectView(Context context, AttributeSet attrs) {super(context, attrs);}

    public ObjectView(Context context, int shapeColor, int initialPositionX, int initialPositionY, ShapeType type) {
        super(context);
        setBackgroundColor(Color.TRANSPARENT);
        paint = new Paint();
        paint.setColor(shapeColor);
        paint.setXfermode(new PorterDuffXfermode(Mode.ADD));
        // paint.setXfermode(new PixelXorXfermode(0xFFFFFFFF));
        shapeType = type;
        setTranslationX(initialPositionX);
        setTranslationY(initialPositionY);
    }

    public ObjectView(Context context, int shapeColor, int initialPositionX, int initialPositionY, ShapeType type, float shapeSizeFactor) {
        this(context, shapeColor, initialPositionX, initialPositionY, type);
        this.shapeSizeFactor = shapeSizeFactor;
    }

    public void onDrawEx(Canvas canvas) {
        switch (shapeType) {
            case CIRCLE:
                int circleXCoordinate = getWidth() / 2;
                int circleYCoordinate = getHeight() / 2;
                int circleRadius = getWidth() / 2;
                canvas.drawCircle(circleXCoordinate, circleYCoordinate, circleRadius, paint);
                break;
            case RECTANBLE:
                float left = 0;
                float top = 0;
                float right = getWidth();
                float bottom = getHeight();
                canvas.drawRect(left, top, right, bottom, paint);
                break;
            case ARBITRARY_SHAPE:
                Path path = new Path();
                path.addPath(path, new Matrix());
                int min = 1;
                int max = 10;
                Random randomShapeIdGenerator = new Random();
                int randomShapeId = randomShapeIdGenerator.nextInt(max - min + 1) + min;
                ShapeFactory.createShape(path, this.shapeSizeFactor, /*randomShapeId*/1);
                canvas.drawPath(path, paint);
                break;
        }
    }

    public boolean isTouched() {return isTouched;}
    public void setTouched(boolean touched) {isTouched = touched;}

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        isTouched = true;
        return super.onTouchEvent(event);
    }
}
