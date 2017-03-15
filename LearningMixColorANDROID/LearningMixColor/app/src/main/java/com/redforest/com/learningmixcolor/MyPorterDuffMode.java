package com.redforest.com.learningmixcolor;

import android.graphics.Bitmap;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Xfermode;
import android.os.Environment;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

/**
 * Created by NeN on 10/03/2017.
 */

public class MyPorterDuffMode extends Xfermode
{


Xfermode x = new Xfermode();

    public static Bitmap applyMixedReality(Bitmap srcBmp, Bitmap destBmp)
    {

        int width = srcBmp.getWidth();
        int height = srcBmp.getHeight();
        int srcPixels[] = new int[width * height];;
        int destPixels[] = new int[width * height];
        int resultPixels[] = new int[width * height];
        int aS = 0, rS = 0, gS = 0, bS = 0;
        int rgbS = 0;
        int aD = 0, rD = 0, gD = 0, bD = 0;
        int rgbD = 0;

        try
        {
            srcBmp.getPixels(srcPixels, 0, width, 0, 0, width, height);
            destBmp.getPixels(destPixels, 0, width, 0, 0, width, height);

            srcBmp.recycle();
            destBmp.recycle();
        }
        catch(IllegalArgumentException e)
        {
        }
        catch(ArrayIndexOutOfBoundsException e)
        {
        }

        for(int y = 0; y < height; y++)
        {
            for(int x = 0; x < width; x++)
            {
                rgbS = srcPixels[y*width + x];
                aS = (rgbS >> 24) & 0xff;
                rS = (rgbS >> 16) & 0xff;
                gS = (rgbS >>  8) & 0xff;
                bS = (rgbS      ) & 0xff;

                rgbD = destPixels[y*width + x];
                aD = ((rgbD >> 24) & 0xff);
                rD = (rgbD >> 16) & 0xff;
                gD = (rgbD >>  8) & 0xff;
                bD = (rgbD      )  & 0xff;

                //overlay-mode
                rS = mixedReality(rD, rS);
                gS = mixedReality(gD, gS);
                bS = mixedReality(bD, bS);
                aS = aS + aD - Math.round((aS * aD)/255f);

                resultPixels[y*width + x] = ((int)aS << 24) | ((int)rS << 16) | ((int)gS << 8) | (int)bS;
            }
        }
        srcBmp.setPixels(resultPixels,0,0,0,0,width, height);
        return srcBmp;
    }

    /**
     * Converts a immutable bitmap to a mutable bitmap. This operation doesn't allocates
     * more memory that there is already allocated.
     *
     * @param imgIn - Source image. It will be released, and should not be used more
     * @return a copy of imgIn, but muttable.
     */
    public static Bitmap convertToMutable(Bitmap imgIn) {
        try {
            //this is the file going to use temporally to save the bytes.
            // This file will not be a image, it will store the raw image data.
            File file = new File(Environment.getExternalStorageDirectory() + File.separator + "temp.tmp");

            //Open an RandomAccessFile
            //Make sure you have added uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
            //into AndroidManifest.xml file
            RandomAccessFile randomAccessFile = new RandomAccessFile(file, "rw");

            // get the width and height of the source bitmap.
            int width = imgIn.getWidth();
            int height = imgIn.getHeight();
            Bitmap.Config type = imgIn.getConfig();

            //Copy the byte to the file
            //Assume source bitmap loaded using options.inPreferredConfig = Config.ARGB_8888;
            FileChannel channel = randomAccessFile.getChannel();
            MappedByteBuffer map = channel.map(FileChannel.MapMode.READ_WRITE, 0, imgIn.getRowBytes()*height);
            imgIn.copyPixelsToBuffer(map);
            //recycle the source bitmap, this will be no longer used.
            imgIn.recycle();
            System.gc();// try to force the bytes from the imgIn to be released

            //Create a new bitmap to load the bitmap again. Probably the memory will be available.
            imgIn = Bitmap.createBitmap(width, height, type);
            map.position(0);
            //load it back from temporary
            imgIn.copyPixelsFromBuffer(map);
            //close the temporary file and channel , then delete that also
            channel.close();
            randomAccessFile.close();

            // delete the temp file
            file.delete();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return imgIn;
    }
    // mixedReality
    private static int mixedReality(int sc, int dc) {
        //int tmp = (sc+dc)/2;

        return (sc+dc)/2;
    }
    /*private  int clamp_div255round(int prod) {
        if (prod <= 0) {
            return 0;
        } else if (prod >= 255*255) {
            return 255;
        } else {
            return Math.round((float)prod/255);
        }
    }*/

}
