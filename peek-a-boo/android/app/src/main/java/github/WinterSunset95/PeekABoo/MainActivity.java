package github.WinterSunset95.PeekABoo;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

import com.getcapacitor.plugin.camera.CameraPlugin;
import com.getcapacitor.plugin.filesystem.FilesystemPlugin;

import io.capawesome.capacitorjs.plugins.firebase.authentication.FirebaseAuthenticationPlugin;
import io.capawesome.capacitorjs.plugins.firebase.firestore.FirebaseFirestorePlugin;
import io.capawesome.capacitorjs.plugins.firebase.storage.FirebaseStoragePlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstateState) {
    super.onCreate(savedInstateState);
    registerPlugin(FirebaseAuthenticationPlugin.class);
    registerPlugin(FirebaseFirestorePlugin.class);
    registerPlugin(FirebaseStoragePlugin.class);
    registerPlugin(CameraPlugin.class);
    registerPlugin(FilesystemPlugin.class);
  }
}
