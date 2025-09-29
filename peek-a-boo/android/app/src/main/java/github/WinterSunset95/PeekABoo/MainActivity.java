package github.WinterSunset95.PeekABoo;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin;
import io.capawesome.capacitorjs.plugins.firebase.firestore.FirebaseFirestorePlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstateState) {
    super.onCreate(savedInstateState);
    registerPlugin(FirebaseAuthenticationPlugin.class);
    registerPlugin(FirebaseFirestorePlugin.class);
  }
}
