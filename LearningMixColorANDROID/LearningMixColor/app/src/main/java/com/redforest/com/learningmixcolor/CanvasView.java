package com.redforest.com.learningmixcolor;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.ColorMatrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by NeN on 09/03/2017.
 */

public class CanvasView extends View {
    private int height,weight;
    private Bitmap bitmapSRC,bitmapNew;
    private Canvas mCanvas;
    private Path path;
    private Paint paint,paintNew;
    private float mX,mY;
    private static final float TOLERANCE = 5;
    Context context;
    Map<Path,Integer> colorPaths;
    ArrayList<Path> paths;
    boolean primera=true;

    public CanvasView(Context context, AttributeSet attributeSet) {
        super(context,attributeSet);
        setBackgroundColor(Color.TRANSPARENT);
        this.context = context;
        colorPaths = new HashMap<>();
        paths = new ArrayList<>();
        path = new Path();
        paintNew=new Paint();
        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.BLACK);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeJoin(Paint.Join.ROUND);
        paint.setStrokeWidth(20f);
        paint.setDither(true);
        paint.setStrokeCap(Paint.Cap.ROUND);
        ColorFilter c = new ColorFilter();
        paint.setColorFilter( new ColorFilter());
        colorPaths.put(path,paint.getColor());
        paths.add(path);
       paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_ATOP));
        //PorterDuff porterDuff = new PorterDuff();
        //PorterDuffXfermode porterDuffXfermode = new PorterDuffXfermode(PorterDuff.Mode.ADD);

        //paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.ADD));
    }
    public void cambiaColor(int color){
        path = new Path();
        paint.setColor(color);
        paths.add(path);
        colorPaths.put(path,paint.getColor());
    }
    @Override
    protected void onDraw(Canvas canvas){
        super.onDraw(canvas);
        for (Path p : paths){
            paint.setColor(colorPaths.get(p));
            mCanvas.drawPath(p, paint);

            /*Bitmap bt = Bitmap.createBitmap(getWidth(),getHeight(),Bitmap.Config.ARGB_8888);
            mCanvas.setBitmap(bt);
            bitmapSRC = MyPorterDuffMode.applyMixedReality(bitmapSRC,bt);
            mCanvas.setBitmap(bitmapSRC);
            ColorMatrix colorMatrix =new ColorMatrix();
            colorMatrix.*/
            //canvas.drawPath(p, paint);
        }
        canvas.drawBitmap(bitmapSRC, 0, 0, paintNew);

    }
    @Override
    protected void onSizeChanged(int w,int h, int oldw, int oldh){
        super.onSizeChanged(w,h,oldw,oldh);
        bitmapSRC = Bitmap.createBitmap(w,h,Bitmap.Config.ARGB_8888);
        mCanvas = new Canvas(bitmapSRC);
    }
    private void startTouch(float x,float y){
        path.moveTo(x,y);
        mX=x;
        mY=y;
    }

    private void moveTouch(float x, float y){
        float dx = Math.abs(x-mX);
        float dy =Math.abs(y-mY);
        if(dx >=TOLERANCE || dy >= TOLERANCE){
            path.quadTo(mX,mY,(x+mX)/2,(y+mY)/2);
            mX=x;
            mY=y;
        }
    }
    public void clearCanvas(){
        path.reset();
        invalidate();
    }
    private void upTouch(){
        path.lineTo(mX,mY);
    }
    @Override
    public boolean onTouchEvent(MotionEvent motionEvent){
        float x = motionEvent.getX();
        float y = motionEvent.getY();
        switch (motionEvent.getAction()){
            case MotionEvent.ACTION_DOWN:
                startTouch(x,y);
                invalidate();
                break;
            case MotionEvent.ACTION_MOVE:
                moveTouch(x,y);
                invalidate();
                break;
            case MotionEvent.ACTION_UP:
                upTouch();
                invalidate();
                break;


        }
        return true;
    }
}