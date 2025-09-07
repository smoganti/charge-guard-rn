package com.chargeguardrnapp;
import android.view.View;

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

        private View nativeCardView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Use the standard savedInstanceState
        super.onCreate(savedInstanceState);
        setTheme(R.style.Theme_Transparent); // Apply transparent theme

            // Show native fallback card immediately
            nativeCardView = createNativeCard();
            setContentView(nativeCardView);
        }

        // When React Native is ready, this will be called and JS will take over
        @Override
        protected void onResume() {
            super.onResume();
            // If ReactRootView is attached, remove native card
            View reactRoot = findViewById(android.R.id.content);
            if (reactRoot != null && reactRoot != nativeCardView) {
                if (nativeCardView != null) {
                    nativeCardView.setVisibility(View.GONE);
                }
            }
        }

        // Helper to create a minimal native card
        private View createNativeCard() {
            android.widget.LinearLayout layout = new android.widget.LinearLayout(this);
            layout.setOrientation(android.widget.LinearLayout.VERTICAL);
            layout.setPadding(48, 48, 48, 48);
            layout.setBackgroundColor(0xCC222222); // semi-transparent dark
            layout.setGravity(android.view.Gravity.CENTER);

            android.widget.TextView title = new android.widget.TextView(this);
            title.setText("Charging...");
            title.setTextSize(22);
            title.setTextColor(0xFFFFFFFF);
            title.setPadding(0, 0, 0, 16);
            layout.addView(title);

            // Battery percentage (dummy, could be improved to fetch real value)
            android.widget.TextView battery = new android.widget.TextView(this);
            battery.setText("Battery: --%");
            battery.setTextSize(18);
            battery.setTextColor(0xFFFFFFFF);
            battery.setPadding(0, 0, 0, 8);
            layout.addView(battery);

            // Charging status
            android.widget.TextView status = new android.widget.TextView(this);
            status.setText("Status: Charging");
            status.setTextSize(18);
            status.setTextColor(0xFFFFFFFF);
            layout.addView(status);

            return layout;
        }
}