package github.WinterSunset95.PeekABoo;

import android.os.Build;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;

public class CustomWebView extends WebViewClient {
    private static final List<String> BLOCKED_URLS = Arrays.asList(
            "https://doubleclick.net",
            ""
    );

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (BLOCKED_URLS.stream().anyMatch(url::startsWith)) {
                return new WebResourceResponse(
                        "text/plain",
                        "utf-8",
                        new ByteArrayInputStream("".getBytes())
                );
            }
        }

        return super.shouldInterceptRequest(view, request);
    };
}
