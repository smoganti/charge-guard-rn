package com.chargeguardrnapp;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class ChargeCardPopupActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ChargeCardPopup";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
                DefaultNewArchitectureEntryPoint.getBridgelessEnabled() // bridgelessEnabled
        );
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Use the standard savedInstanceState
        super.onCreate(savedInstanceState);
        setTheme(R.style.Theme_Transparent); // Apply transparent theme
    }
}