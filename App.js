import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { usePreventScreenCapture } from "expo-screen-capture";

const App = () => {
  usePreventScreenCapture();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleWebViewError = () => {
    setError(true);
    setLoading(false);
  };

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const reloadWebView = () => {
    if (webViewRef.current) {
      setError(false);
      setLoading(true);
      webViewRef.current.reload();
    }
  };

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  const renderErrorPage = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        تعذر تحميل المحتوى في الوقت الحالي. حاول مرة أخرى لاحقاً.
      </Text>
      <TouchableOpacity onPress={reloadWebView} style={styles.retryButton}>
        <Text style={styles.retryText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => webViewRef.current.goBack()}>
          {canGoBack && <Text style={styles.navBarButton}>الرجوع</Text>}
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error ? (
        renderErrorPage()
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: "https://elshamel-academy.com/profile/1" }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onNavigationStateChange={onNavigationStateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navBarButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default App;
